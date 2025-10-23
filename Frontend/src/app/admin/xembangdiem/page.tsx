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

  function handleCreate() {
    if (raw) {
      router.push(`/admin/chinhsuabangdiem?raw=${raw}`);
    } else {
      alert("Không tìm thấy thông tin raw trong URL!");
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

  // Helper: định dạng ngày về dd/MM/yyyy (an toàn với nhiều kiểu đầu vào)
function formatDateToDDMMYYYY(dateInput: string | null | undefined) {
  if (!dateInput) return null;
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return null;
  const dd = d.getDate().toString().padStart(2, "0");
  const mm = (d.getMonth() + 1).toString().padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
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
        <button onClick={handleCopy} className="bangDiem-btn">
          Sao chép bảng điểm
        </button>

        <button onClick={handleCreate} className="bangDiem-btn">
          Chỉnh sửa bảng điểm
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
