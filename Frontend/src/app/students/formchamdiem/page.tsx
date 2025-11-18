"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "./../../styles/students/bangchamdiem.css";

type TieuChi = {
  ma_sinh_vien_diem_ren_luyen_chi_tiet: string;
  ten_tieu_chi: string;
  muc_diem: number;
  muc: string;
  diem: number;
  mo_ta_diem: string;
  ma_tieu_chi_cha: string;
  loai_tieu_chi: string;
  so_lan: number;
};

export default function ChamDiem() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const raw = searchParams.get("raw");

  const [masinhvien, setMasinhvien] = useState("");
  const [mahocky, setMahocky] = useState("");
  const [tieuChiList, setTieuChiList] = useState<TieuChi[]>([]);
  const [selectedValues, setSelectedValues] = useState<Record<string, any>>({});

  // Lấy mã sinh viên và học kỳ từ localStorage hoặc query (chỉ khi window tồn tại)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const sessionRaw =
        localStorage.getItem("session") ||
        localStorage.getItem("user") ||
        localStorage.getItem("sessionData") ||
        "{}";
      let session = {};
      try {
        session = JSON.parse(sessionRaw);
      } catch {
        session = {};
      }
      setMasinhvien(
        (session as any)?.ma_sinh_vien ||
        (session as any)?.masv ||
        (session as any)?.id ||
        searchParams.get("masinhvien") ||
        ""
      );
      setMahocky(
        (session as any)?.ma_hoc_ky ||
        (session as any)?.ma_hocky ||
        searchParams.get("mahocky") ||
        ""
      );
    }
  }, [searchParams]);

  // Fetch tiêu chí từ API khi đã có mã sinh viên và học kỳ
  useEffect(() => {
    if (!masinhvien || !mahocky) return;
    fetch(
      `http://localhost:8080/api/xemtieuchicham/${masinhvien}/${mahocky}`
    )
      .then((res) => res.json())
      .then((data) => {
        setTieuChiList(data.danh_sach_tieu_chi || []);
      });
  }, [masinhvien, mahocky]);

  // Load dữ liệu đã lưu nháp (nếu có)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("luuNhapBangDiem");
      if (saved) {
        const parsed = JSON.parse(saved);
        setSelectedValues(parsed.selectedValues || {});
      }
    }
  }, []);

  // Lưu nháp
  function handleCopy() {
    if (typeof window !== "undefined") {
      const saveData = { selectedValues };
      localStorage.setItem("luuNhapBangDiem", JSON.stringify(saveData));
      alert("Đã lưu nháp thành công!");
      router.push(`/students/formchamdiem/luunhap`);
    }
  }

  // Gửi bảng điểm
  function handleCreate() {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "guiBangDiem",
        JSON.stringify({ selectedValues })
      );
      alert("Bạn đã gửi bảng điểm thành công, quay lại trang chủ ?");
      router.push(`/students`);
    }
  }

  // Xử lý checkbox
  const handleCheckbox = (tc: TieuChi) => {
    setSelectedValues((prev) => {
      const current = prev[tc.ma_tieu_chi_cha || tc.muc] || [];
      if (current.includes(tc.muc)) {
        return { ...prev, [tc.ma_tieu_chi_cha || tc.muc]: current.filter((v: string) => v !== tc.muc) };
      } else {
        return { ...prev, [tc.ma_tieu_chi_cha || tc.muc]: [...current, tc.muc] };
      }
    });
  };

  // Xử lý radio
  const handleRadio = (tc: TieuChi) => {
    setSelectedValues((prev) => ({
      ...prev,
      [tc.ma_tieu_chi_cha]: [tc.muc],
    }));
  };

  // Xử lý textbox nhập số lần
  const handleTextbox = (tc: TieuChi, value: string) => {
    setSelectedValues((prev) => ({
      ...prev,
      [tc.muc]: [value],
    }));
  };

  // Tính điểm từng tiêu chí
  const getDiemTieuChi = (tc: TieuChi) => {
    if (tc.loai_tieu_chi === "textbox") {
      const rawVal = selectedValues[tc.muc]?.[0];
      const count = rawVal ? parseInt(rawVal) : 0;
      if (!count || isNaN(count)) return "";
      return count * tc.diem + "đ";
    }
    const group = tc.ma_tieu_chi_cha || tc.muc;
    const selected = selectedValues[group] || [];
    if (selected.includes(tc.muc)) {
      return tc.diem + "đ";
    }
    return "";
  };

  // Tính tổng điểm
  const calcAllTotal = () => {
    return tieuChiList.reduce((sum, tc) => {
      if (tc.loai_tieu_chi === "textbox") {
        const rawVal = selectedValues[tc.muc]?.[0];
        const count = rawVal ? parseInt(rawVal) : 0;
        if (!count || isNaN(count)) return sum;
        return sum + count * tc.diem;
      }
      const group = tc.ma_tieu_chi_cha || tc.muc;
      const selected = selectedValues[group] || [];
      if (selected.includes(tc.muc)) {
        return sum + tc.diem;
      }
      return sum;
    }, 0);
  };

  // Xếp loại
  const getRank = () => {
    const total = calcAllTotal();
    if (total >= 90) return "Xuất sắc";
    if (total >= 80) return "Giỏi";
    if (total >= 65) return "Khá";
    if (total >= 50) return "Trung bình";
    return "Yếu";
  };

  // Hàm sắp xếp tiêu chí giống admin
  function sortBangDiem(data: TieuChi[]) {
    const romanOrder = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
    const numberOrder = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    const letterOrder = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split("");

    // Cha lớn: muc là I, II, III, ...
    const chaLon = data
      .filter((item) => item.ma_tieu_chi_cha === "")
      .sort((a, b) => romanOrder.indexOf(a.muc) - romanOrder.indexOf(b.muc));

    // Cha nhỏ: muc là 1, 2, 3,... và ma_tieu_chi_cha là mã của cha lớn
    function getChaNho(maChaLon: string) {
      return data
        .filter((item) => item.ma_tieu_chi_cha === maChaLon && numberOrder.includes(item.muc))
        .sort((a, b) => numberOrder.indexOf(a.muc) - numberOrder.indexOf(b.muc));
    }

    // Con: muc là a, b,... và ma_tieu_chi_cha là mã của cha nhỏ
    function getCon(maChaNho: string) {
      return data
        .filter((item) => item.ma_tieu_chi_cha === maChaNho && letterOrder.includes(item.muc.toUpperCase()))
        .sort((a, b) => letterOrder.indexOf(a.muc.toUpperCase()) - letterOrder.indexOf(b.muc.toUpperCase()));
    }

    let sorted: TieuChi[] = [];
    for (const cha of chaLon) {
      sorted.push(cha);
      const chaNhoList = getChaNho(cha.ma_sinh_vien_diem_ren_luyen_chi_tiet);
      for (const chaNho of chaNhoList) {
        sorted.push(chaNho);
        const conList = getCon(chaNho.ma_sinh_vien_diem_ren_luyen_chi_tiet);
        sorted.push(...conList);
      }
    }

    // Nếu còn mục nào chưa được sắp thì thêm vào cuối
    if (sorted.length < data.length) {
      const sortedIds = new Set(sorted.map((i) => i.ma_sinh_vien_diem_ren_luyen_chi_tiet));
      const missing = data.filter((i) => !sortedIds.has(i.ma_sinh_vien_diem_ren_luyen_chi_tiet));
      return [...sorted, ...missing];
    }

    return sorted;
  }

  return (
    <div className="bangdiem_students-container">
      <h2>Bảng điểm rèn luyện</h2>
      <table className="bangdiem_students-table">
        <thead>
          <tr>
            <th>Mục</th>
            <th>Nội dung đánh giá</th>
            <th>Mô tả</th>
            <th>Điểm</th>
            <th>Hành động</th>
            <th>Điểm</th>
          </tr>
        </thead>
        <tbody>
          {sortBangDiem(tieuChiList).map((tc, idx) => {
            const isBig = tc.ma_tieu_chi_cha === "" || tc.ma_tieu_chi_cha === null;
            const group = tc.ma_tieu_chi_cha || tc.muc;
            const selected = selectedValues[group] || [];
            const isSelected = selected.includes(tc.muc);

            return (
              <tr key={tc.ma_sinh_vien_diem_ren_luyen_chi_tiet}>
                <td style={{ fontWeight: isBig ? "bold" : "normal" }}>{tc.muc}</td>
                <td style={{ fontWeight: isBig ? "bold" : "normal" }}>{tc.ten_tieu_chi}</td>
                <td>{tc.mo_ta_diem || ""}</td>
                <td>
                  {tc.loai_tieu_chi === "none" && <span>_</span>}
                  {tc.loai_tieu_chi === "checkbox" && (
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleCheckbox(tc)}
                    />
                  )}
                  {tc.loai_tieu_chi === "radio" && (
                    <input
                      type="radio"
                      name={tc.ma_tieu_chi_cha}
                      checked={isSelected}
                      onChange={() => handleRadio(tc)}
                    />
                  )}
                  {tc.loai_tieu_chi === "textbox" && (
                    <input
                      type="number"
                      min={0}
                      max={10}
                      step={1}
                      value={selectedValues[tc.muc]?.[0] || ""}
                      onChange={(e) => handleTextbox(tc, e.target.value)}
                    />
                  )}
                </td>
                <td style={{ fontWeight: "bold" }}>{getDiemTieuChi(tc)}</td>
              </tr>
            );
          })}
          <tr className="all-total">
            <td colSpan={4} style={{ fontWeight: "bold" }}>
              Tổng điểm
            </td>
            <td style={{ fontWeight: "bold" }}>{calcAllTotal()}</td>
          </tr>
          <tr className="rank-row">
            <td colSpan={4} style={{ fontWeight: "bold" }}>
              Xếp loại
            </td>
            <td style={{ fontWeight: "bold" }}>{getRank()}</td>
          </tr>
        </tbody>
      </table>

      <div className="bangdiem_students-buttons">
        <button onClick={handleCopy} className="bangdiem_students-btn">
          Lưu nháp
        </button>
        <button onClick={handleCreate} className="bangdiem_students-btn">
          Gửi bảng điểm
        </button>
      </div>
    </div>
  );
}