"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "./../../styles/Admin/BangDiem.css";

interface BangDiemChiTiet {
  ma_tieu_chi: string;
  ma_bang_diem_tham_chieu: string;
  ten_tieu_chi: string;
  muc_diem: number;
  muc: string;
  diem: number;
  mo_ta_diem: string;
  ma_tieu_chi_cha: string;
  loai_tieu_chi: string;
  so_lan: number;
}

export default function BangDiem() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const raw = searchParams.get("raw"); // lấy raw từ URL hiện tại

  const [diemData, setDiemData] = useState<BangDiemChiTiet[]>([]);
  const [loading, setLoading] = useState(true);
  const [issending, setIssending] = useState(false); // trạng thái gửi phát bảng điểm
  const [checkingStatus, setCheckingStatus] = useState(false); // trạng thái kiểm tra trước khi vào chỉnh sửa

  useEffect(() => {
    if (!raw) return;
    setLoading(true);
    fetch(`http://localhost:8080/api/xemtieuchi/${raw}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("API data:", data);
        setDiemData(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setDiemData([]);
        setLoading(false);
      });
  }, [raw]);

  // Tách năm học và học kỳ từ raw
  let namHoc = "";
  let hocKy = "";
  if (raw) {
    const match = raw.match(/^([0-9\-]+)\.(\d)_BD/);
    if (match) {
      namHoc = match[1];
      hocKy = match[2];
    }
  }

  /**
   * Helper: định dạng ngày về dd/MM/yyyy (an toàn với nhiều kiểu đầu vào)
   */
  function formatDateToDDMMYYYY(dateInput: string | null | undefined) {
    if (!dateInput) return null;
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return null;
    const dd = d.getDate().toString().padStart(2, "0");
    const mm = (d.getMonth() + 1).toString().padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  /**
   * Helper: chuẩn hoá text để so sánh (lowercase, remove extra spaces)
   */
  const normalize = (s: string) => (s || "").toString().toLowerCase().trim();

  /**
   * Decide whether the API response indicates "Đã Phát" / issued.
   * Hỗ trợ nhiều trường hợp: chuỗi, object với nhiều tên fields, tiếng Việt / tiếng Anh.
   * Trả về: "issued" | "not_issued" | "unknown"
   */
  const interpretStatus = (data: any): "issued" | "not_issued" | "unknown" => {
    if (data == null) return "unknown";

    // Nếu API trả về chuỗi trực tiếp
    if (typeof data === "string") {
      const text = normalize(data);
      // check explicit patterns
      if (text.includes("đã phát") || text.includes("da phat") || text.includes("issued") || text.includes("published") || text.includes("released")) {
        // ensure not something like "not issued"
        if (text.includes("chưa") || text.includes("not") || text.includes("not issued") || text.includes("not published")) {
          return "not_issued";
        }
        return "issued";
      }
      if (text.includes("chưa phát") || text.includes("chua phat") || text.includes("not issued") || text.includes("not published")) {
        return "not_issued";
      }
      return "unknown";
    }

    // Nếu API trả về object - tìm các trường thông dụng
    if (typeof data === "object") {
      // các keys tiềm năng chứa trạng thái
      const keysToCheck = ["trang_thai", "trangThai", "status", "state", "message", "result", "trang_thai_text", "text"];
      for (const key of keysToCheck) {
        if (key in data && data[key] != null) {
          const val = normalize(String(data[key]));
          if (val.includes("đã phát") || val.includes("da phat") || val.includes("issued") || val.includes("published") || val.includes("released")) {
            if (val.includes("chưa") || val.includes("not")) return "not_issued";
            return "issued";
          }
          if (val.includes("chưa phát") || val.includes("chua phat") || val.includes("not issued") || val.includes("not published")) {
            return "not_issued";
          }
        }
      }

      // có thể server trả về boolean hoặc cờ khác như is_issued, da_phat...
      const booleanKeys = ["is_issued", "da_phat", "isPublished", "issued", "published"];
      for (const key of booleanKeys) {
        if (key in data) {
          const v = data[key];
          if (v === true || v === "true" || v === 1) return "issued";
          if (v === false || v === "false" || v === 0) return "not_issued";
        }
      }

      // server có thể trả {error: "...", ngay_het_hang: "..."} khi đã phát
      if ("error" in data && data.error) {
        const err = normalize(String(data.error));
        if (err.includes("exists already") || err.includes("đã phát") || err.includes("da phat")) return "issued";
      }

      return "unknown";
    }

    return "unknown";
  };

  /**
   * Mới: khi bấm chỉnh sửa — kiểm tra trạng thái bảng điểm trước.
   * Nếu "Đã Phát" => show alert và không chuyển.
   * Nếu "Chưa Phát" => chuyển sang trang chỉnh sửa.
   * Nếu "unknown" => cảnh báo và không chuyển (an toàn).
   */
  async function handleCreate() {
    if (!raw) {
      alert("Không tìm thấy thông tin raw trong URL!");
      return;
    }

    setCheckingStatus(true);

    try {
      const res = await fetch(`http://localhost:8080/api/xemtrangthaibangdiem/${raw}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch (e) {
        data = null;
      }

      console.log("xemtrangthaibangdiem response:", res.status, data);

      // interpret status robustly
      const interpreted = interpretStatus(data);

      if (interpreted === "issued") {
        // nếu server trả ngày hết hạn thì hiển thị thêm
        let ngayHetHang: string | null = null;
        if (data && (data.ngay_het_hang || data.expire_date || data.expiry_date)) {
          ngayHetHang = data.ngay_het_hang || data.expire_date || data.expiry_date || null;
        }
        const formatted = formatDateToDDMMYYYY(ngayHetHang);
        if (formatted) {
          alert(`Bảng điểm đã phát không thể chỉnh sửa.\nThời gian hết hạn: ${formatted}`);
        } else {
          alert("Bảng điểm đã phát không thể chỉnh sửa");
        }
        return;
      }

      if (interpreted === "not_issued") {
        // cho phép chuyển
        router.push(`/admin/chinhsuabangdiem?raw=${raw}`);
        return;
      }

      // nếu không xác định được trạng thái, báo cho user (an toàn: không chuyển)
      alert("Không thể xác định trạng thái bảng điểm. Vui lòng thử lại hoặc kiểm tra server.");
    } catch (err) {
      console.error("Lỗi khi kiểm tra trạng thái bảng điểm:", err);
      alert("Không thể kiểm tra trạng thái bảng điểm. Vui lòng thử lại.");
    } finally {
      setCheckingStatus(false);
    }
  }

  function handleCopy() {
    if (!raw) {
      alert("Không tìm thấy thông tin raw trong URL!");
      return;
    }
    // Lưu dữ liệu hiện tại vào localStorage
    localStorage.setItem("bangdiem_sao_chep", raw);
    router.push(`/admin/saochephocky`);
  }

  // ✅ Gọi API phát bảng điểm (đã sửa để xử lý response bạn cung cấp)
  async function handlePhatBangDiem() {
    if (!raw) {
      alert("Không tìm thấy thông tin raw trong URL!");
      return;
    }

    const ma_bang_diem_phat = raw;
    const ma_hoc_ky_phat = raw.replace(/_BD$/, "");

    const payload = {
      ma_bang_diem_phat,
      ma_hoc_ky_phat,
    };

    try {
      setIssending(true);

      const res = await fetch("http://localhost:8080/api/phatbangdiem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Luôn parse JSON (server trả cả lỗi kèm JSON)
      let data: any = null;
      try {
        data = await res.json();
      } catch (e) {
        data = null;
      }
      console.log("Phát bảng điểm response:", res.status, data);

<<<<<<< HEAD
    // Trường hợp thành công (200) theo format bạn nêu
    if (res.ok && data && data.message) {
      const formatted = formatDateToDDMMYYYY(data.ngay_het_hang);
      if (formatted) {
        alert(`Phát bảng điểm thành công.\nThời gian hết hạn: ${formatted}`);
        router.push(`/admin`);
      } else {
        alert("Phát bảng điểm thành công.");
        router.push(`/admin`);
=======
      // Trường hợp server trả 400 với error (đã được phát trước đó)
      if (res.status === 400 && data && data.error) {
        // server gửi key "ngay_het_hang"
        const formatted = formatDateToDDMMYYYY(data.ngay_het_hang);
        if (formatted) {
          alert(`Bảng điểm đã được phát.\nThời gian hết hạn: ${formatted}`);
        } else {
          alert("Bảng điểm đã được phát.");
        }
        return;
>>>>>>> d4b2f8c9f0664278d90ff1254d02aec0eb9e83e1
      }

      // Trường hợp thành công (200) theo format bạn nêu
      if (res.ok && data && data.message) {
        const formatted = formatDateToDDMMYYYY(data.ngay_het_hang);
        if (formatted) {
          alert(`Phát bảng điểm thành công.\nThời gian hết hạn: ${formatted}`);
        } else {
          alert("Phát bảng điểm thành công.");
        }
        return;
      }

      // Fallback: nếu status không OK nhưng không có error, hoặc response không đúng định dạng
      alert("Phát bảng điểm không thành công");
    } catch (error) {
      console.error("Error phat bang diem:", error);
      alert("Phát bảng điểm không thành công");
    } finally {
      setIssending(false);
    }
  }

  // ✅ Hàm sắp xếp bảng điểm
  function sortBangDiem(data: BangDiemChiTiet[]) {
    const romanOrder = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
    const numberOrder = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    const letterOrder = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split("");

    const muc1 = data
      .filter((item) => item.ma_tieu_chi_cha === "")
      .sort((a, b) => romanOrder.indexOf(a.muc) - romanOrder.indexOf(b.muc));

    function getChildren(parentMa: string): BangDiemChiTiet[] {
      const children = data
        .filter((item) => item.ma_tieu_chi_cha === parentMa)
        .sort((a, b) => {
          const maA = a.muc.toUpperCase();
          const maB = b.muc.toUpperCase();
          const isNumber = (val: string) => /^[0-9]+$/.test(val);
          const isRoman = (val: string) => romanOrder.includes(val);
          const isLetter = (val: string) => /^[A-Z]$/.test(val);

          if (isRoman(maA) && isRoman(maB)) return romanOrder.indexOf(maA) - romanOrder.indexOf(maB);
          if (isNumber(maA) && isNumber(maB)) return parseInt(maA) - parseInt(maB);
          if (isLetter(maA) && isLetter(maB)) return letterOrder.indexOf(maA) - letterOrder.indexOf(maB);
          return maA.localeCompare(maB);
        });

      let result: BangDiemChiTiet[] = [];
      for (const child of children) {
        result.push(child);
        result = result.concat(getChildren(child.ma_tieu_chi));
      }
      return result;
    }

    let sorted: BangDiemChiTiet[] = [];
    for (const cha of muc1) {
      sorted.push(cha);
      sorted = sorted.concat(getChildren(cha.ma_tieu_chi));
    }

    if (sorted.length < data.length) {
      const sortedIds = new Set(sorted.map((i) => i.ma_tieu_chi));
      const missing = data.filter((i) => !sortedIds.has(i.ma_tieu_chi));
      return [...sorted, ...missing];
    }

    return sorted;
  }

  return (
    <div className="bangDiem-container">
      <h2>Bảng điểm rèn luyện</h2>

      {namHoc && hocKy && (
        <div style={{ fontWeight: 600, color: "#003366", marginBottom: 8 }}>
          Năm học: {namHoc} &nbsp;|&nbsp; Học kỳ: {hocKy}
        </div>
      )}

      {loading ? (
        <div>Đang tải dữ liệu...</div>
      ) : (
        <table className="bangDiem-table">
          <thead>
            <tr>
              <th>Mục</th>
              <th>Nội dung đánh giá</th>
              <th>Mô tả</th>
              <th>Điểm</th>
            </tr>
          </thead>
          <tbody>
            {diemData.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", color: "#888" }}>
                  Không có dữ liệu bảng điểm
                </td>
              </tr>
            ) : (
              sortBangDiem(diemData).map((item) => (
                <tr key={item.ma_tieu_chi}>
                  <td>{item.muc}</td>
                  <td>{item.ten_tieu_chi}</td>
                  <td>{item.mo_ta_diem}</td>
                  <td>{item.diem}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* ✅ Các nút thao tác */}
      <div
        className="bangDiem-buttons"
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "16px", // khoảng cách đều giữa 3 nút
          marginTop: "20px",
        }}
      >
        <button onClick={handleCopy} className="bangDiem-btn" disabled={checkingStatus}>
          Sao chép bảng điểm
        </button>

        <button
          onClick={handleCreate}
          className="bangDiem-btn"
          disabled={checkingStatus}
        >
          {checkingStatus ? "Đang kiểm tra..." : "Chỉnh sửa bảng điểm"}
        </button>

        <button
          onClick={handlePhatBangDiem}
          className="bangDiem-btn"
          disabled={issending}
        >
          {issending ? "Đang phát..." : "Phát bảng điểm"}
        </button>
      </div>
    </div>
  );
}
