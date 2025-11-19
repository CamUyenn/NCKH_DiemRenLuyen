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
  _ma?: string;
  _maCha?: string;
};

export default function ChamDiem() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [masinhvien, setMasinhvien] = useState("");
  const [mahocky, setMahocky] = useState("");
  const [tieuChiList, setTieuChiList] = useState<TieuChi[]>([]);
  const [selectedValues, setSelectedValues] = useState<Record<string, any>>({});

  // Helpers: tách phần sau dấu "~"
  function getCode(id?: string | null): string {
    if (!id) return "";
    return id.includes("~") ? id.split("~")[1] : id;
  }
  const getParentCode = (id?: string | null) => getCode(id);

  // Lấy session / params
  useEffect(() => {
    if (typeof window === "undefined") return;
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
  }, [searchParams]);

  // Fetch tiêu chí từ API và chuẩn hoá _ma / _maCha
  useEffect(() => {
    if (!masinhvien || !mahocky) return;

    fetch(`http://localhost:8080/api/xemtieuchicham/${masinhvien}/${mahocky}`)
      .then((res) => res.json())
      .then((data) => {
        const danhSachRaw = data?.danh_sach_tieu_chi || [];
        const danhSach: TieuChi[] = danhSachRaw.map((item: any) => ({
          ...item,
          _ma: getCode(item?.ma_sinh_vien_diem_ren_luyen_chi_tiet),
          _maCha: getParentCode(item?.ma_tieu_chi_cha),
        }));
        setTieuChiList(danhSach);
      })
      .catch((err) => {
        console.error("Lỗi khi fetch tiêu chí:", err);
        setTieuChiList([]);
      });
  }, [masinhvien, mahocky]);

  // Load dữ liệu đã lưu nháp
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("luuNhapBangDiem");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSelectedValues(parsed.selectedValues || {});
      } catch {
        // ignore
      }
    }
  }, []);

  // ... (Giữ nguyên các hàm handleCopy, handleCreate, handleCheckbox, handleRadio, handleTextbox, getDiemTieuChi, calcAllTotal, getRank) ...

  function handleCopy() {
    if (typeof window === "undefined") return;
    localStorage.setItem("luuNhapBangDiem", JSON.stringify({ selectedValues }));
    alert("Đã lưu nháp thành công!");
    router.push(`/students/formchamdiem/luunhap`);
  }

  function handleCreate() {
    if (typeof window === "undefined") return;
    localStorage.setItem("guiBangDiem", JSON.stringify({ selectedValues }));
    alert("Bạn đã gửi bảng điểm thành công, quay lại trang chủ ?");
    router.push(`/students`);
  }

  // Xử lý input
  const handleCheckbox = (tc: TieuChi) => {
    const group = tc._maCha || tc.muc;
    setSelectedValues((prev) => {
      const current = prev[group] || [];
      if (current.includes(tc.muc)) {
        return { ...prev, [group]: current.filter((v: string) => v !== tc.muc) };
      } else {
        return { ...prev, [group]: [...current, tc.muc] };
      }
    });
  };

  const handleRadio = (tc: TieuChi) => {
    const group = tc._maCha || tc.muc;
    setSelectedValues((prev) => ({ ...prev, [group]: [tc.muc] }));
  };

  const handleTextbox = (tc: TieuChi, value: string) => {
    setSelectedValues((prev) => ({ ...prev, [tc.muc]: [value] }));
  };

  const getDiemTieuChi = (tc: TieuChi) => {
    if (tc.loai_tieu_chi === "Textbox") {
      const rawVal = selectedValues[tc.muc]?.[0];
      const count = rawVal ? parseInt(rawVal) : 0;
      if (!count || isNaN(count)) return "";
      return count * (tc.diem || 0) + "đ";
    }
    const group = tc._maCha || tc.muc;
    const selected = selectedValues[group] || [];
    return selected.includes(tc.muc) ? (tc.diem || 0) + "đ" : "";
  };

  // Tổng điểm & xếp loại
  const calcAllTotal = () => {
    return tieuChiList.reduce((sum, tc) => {
      if (tc.loai_tieu_chi === "Textbox") {
        const rawVal = selectedValues[tc.muc]?.[0];
        const count = rawVal ? parseInt(rawVal) : 0;
        return !count || isNaN(count) ? sum : sum + count * (tc.diem || 0);
      }
      const group = tc._maCha || tc.muc;
      const selected = selectedValues[group] || [];
      return selected.includes(tc.muc) ? sum + (tc.diem || 0) : sum;
    }, 0);
  };

  const getRank = () => {
    const total = calcAllTotal();
    if (total >= 90) return "Xuất sắc";
    if (total >= 80) return "Giỏi";
    if (total >= 65) return "Khá";
    if (total >= 50) return "Trung bình";
    return "Yếu";
  };

  // Sắp xếp tiêu chí
  function sortBangDiem(data: TieuChi[]) {
    const romanOrder = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
    const numberOrder = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    const letterOrder = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    const chaLon = data
      .filter((item) => (item._maCha ?? "") === "")
      .sort((a, b) => romanOrder.indexOf(a.muc) - romanOrder.indexOf(b.muc));

    function getChaNho(maChaLon: string) {
      return data
        .filter((item) => (item._maCha ?? "") === maChaLon && numberOrder.includes(item.muc))
        .sort((a, b) => numberOrder.indexOf(a.muc) - numberOrder.indexOf(b.muc));
    }

    function getCon(maChaNho: string) {
      return data
        .filter((item) => (item._maCha ?? "") === maChaNho && letterOrder.includes(item.muc.toUpperCase()))
        .sort((a, b) => letterOrder.indexOf(a.muc.toUpperCase()) - letterOrder.indexOf(b.muc.toUpperCase()));
    }

    let sorted: TieuChi[] = [];
    for (const cha of chaLon) {
      sorted.push(cha);
      const chaNhoList = getChaNho(cha._ma || "");
      for (const cn of chaNhoList) {
        sorted.push(cn);
        sorted.push(...getCon(cn._ma || ""));
      }
    }

    const used = new Set(sorted.map((i) => i.ma_sinh_vien_diem_ren_luyen_chi_tiet));
    const missing = data.filter((i) => !used.has(i.ma_sinh_vien_diem_ren_luyen_chi_tiet));
    return [...sorted, ...missing];
  }
  // ==========================================================

  // Render
  return (
    <div className="bangdiem_students-container">
      <h2>Bảng điểm rèn luyện</h2>

      <table className="bangdiem_students-table">
        <thead>
          <tr>
            <th>Mục</th>
            <th>Nội dung</th>
            <th>Mô tả</th>
            <th>Số Điểm</th> {/* cột mới */}
            <th>Hành động</th>
            <th>Điểm Sinh Viên</th> {/* đổi tên */}
          </tr>
        </thead>

        <tbody>
          {sortBangDiem(tieuChiList).map((tc) => {
            const group = tc._maCha || tc.muc;
            const selected = selectedValues[group] || [];
            const isSelected = selected.includes(tc.muc);
            const isBig = (tc._maCha ?? "") === "";

            const diemBackend =
              tc.diem > 0 ? `+${tc.diem}` : tc.diem < 0 ? `${tc.diem}` : "0";

            return (
              <tr key={tc.ma_sinh_vien_diem_ren_luyen_chi_tiet}>
                <td style={{ fontWeight: isBig ? "bold" : "normal" }}>{tc.muc}</td>
                <td style={{ fontWeight: isBig ? "bold" : "normal" }}>{tc.ten_tieu_chi}</td>
                <td>{tc.mo_ta_diem || ""}</td>
                <td style={{ fontWeight: "bold" }}>{diemBackend}</td> {/* cột mới */}
                <td>
                  {tc.loai_tieu_chi === "None" && <span>_</span>}
                  {tc.loai_tieu_chi === "Checkbox" && (
                    <input type="checkbox" checked={isSelected} onChange={() => handleCheckbox(tc)} />
                  )}
                  {tc.loai_tieu_chi === "Radio" && (
                    <input
                      type="radio"
                      name={tc._maCha || tc.muc}
                      checked={isSelected}
                      onChange={() => handleRadio(tc)}
                    />
                  )}
                  {tc.loai_tieu_chi === "Textbox" && (
                    <input
                      type="number"
                      min={0}
                      max={10}
                      step={1}
                      className="textbox-input"
                      value={selectedValues[tc.muc]?.[0] || ""}
                      onChange={(e) => handleTextbox(tc, e.target.value)}
                    />
                  )}
                </td>
                <td style={{ fontWeight: "bold" }}>{getDiemTieuChi(tc)}</td> {/* Điểm Sinh Viên */}
              </tr>
            );
          })}

          <tr className="all-total">
            <td colSpan={5} style={{ fontWeight: "bold" }}>
              Tổng điểm
            </td>
            <td style={{ fontWeight: "bold" }}>{calcAllTotal()}</td>
          </tr>

          <tr className="rank-row">
            <td colSpan={5} style={{ fontWeight: "bold" }}>
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
