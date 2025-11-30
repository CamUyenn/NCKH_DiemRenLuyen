"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "./../../styles/students/xemchitiet.css";

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
  diem_sinh_vien_danh_gia: number;
  diem_lop_truong_danh_gia: number; 
  _ma?: string;
  _maCha?: string;
};

export default function ChamDiem() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [masinhvien, setMasinhvien] = useState("");
  const [mahocky, setMahocky] = useState("");
  const [tieuChiList, setTieuChiList] = useState<TieuChi[]>([]);

  // Tách state: 1 cho SV (chỉ đọc), 1 cho Lớp trưởng (để chấm)
  const [studentSelectedValues, setStudentSelectedValues] = useState<Record<string, any>>({});
  const [classPresidentSelectedValues, setClassPresidentSelectedValues] = useState<Record<string, any>>({});

  // Helpers
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

  // Fetch API và khởi tạo cả 2 state
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

        // Khởi tạo giá trị đã chọn cho SINH VIÊN và LỚP TRƯỞNG
        const initialStudentValues: Record<string, any> = {};
        const initialClassPresidentValues: Record<string, any> = {};

        danhSach.forEach((tc) => {
          // Logic cho điểm sinh viên (chỉ đọc)
          if (tc.diem_sinh_vien_danh_gia > 0) {
            if (tc.loai_tieu_chi === "Textbox" && tc.diem > 0) {
              const soLan = Math.round(tc.diem_sinh_vien_danh_gia / tc.diem);
              initialStudentValues[tc.muc] = [soLan.toString()];
            } else if (tc.loai_tieu_chi === "Checkbox" || tc.loai_tieu_chi === "Radio") {
              const group = tc._maCha || tc.muc;
              const current = initialStudentValues[group] || [];
              initialStudentValues[group] = [...current, tc.muc];
            }
          }

          // Logic cho điểm lớp trưởng (để chấm)
          if (tc.diem_lop_truong_danh_gia > 0) {
             if (tc.loai_tieu_chi === "Textbox" && tc.diem > 0) {
              const soLan = Math.round(tc.diem_lop_truong_danh_gia / tc.diem);
              initialClassPresidentValues[tc.muc] = [soLan.toString()];
            } else if (tc.loai_tieu_chi === "Checkbox" || tc.loai_tieu_chi === "Radio") {
              const group = tc._maCha || tc.muc;
              const current = initialClassPresidentValues[group] || [];
              initialClassPresidentValues[group] = [...current, tc.muc];
            }
          }
        });
        setStudentSelectedValues(initialStudentValues);
        setClassPresidentSelectedValues(initialClassPresidentValues);
      })
      .catch((err) => {
        console.error("Lỗi khi fetch tiêu chí:", err);
        setTieuChiList([]);
      });
  }, [masinhvien, mahocky]);

  // Các hàm handle... bây giờ sẽ cập nhật state của LỚP TRƯỞNG
  const handleCheckbox = (tc: TieuChi) => {
    const group = tc._maCha || tc.muc;
    setClassPresidentSelectedValues((prev) => {
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
    setClassPresidentSelectedValues((prev) => ({ ...prev, [group]: [tc.muc] }));
  };

  const handleTextbox = (tc: TieuChi, value: string) => {
    setClassPresidentSelectedValues((prev) => ({ ...prev, [tc.muc]: [value] }));
  };

  // Hàm tính điểm được tham số hóa để dùng cho cả 2 vai trò
  const getDiemTieuChi = (tc: TieuChi, role: 'student' | 'classPresident') => {
    const values = role === 'student' ? studentSelectedValues : classPresidentSelectedValues;
    
    if (tc.loai_tieu_chi === "Textbox") {
      const rawVal = values[tc.muc]?.[0];
      const count = rawVal ? parseInt(rawVal) : 0;
      if (!count || isNaN(count)) return "";
      return count * (tc.diem || 0) + "đ";
    }
    const group = tc._maCha || tc.muc;
    const selected = values[group] || [];
    return selected.includes(tc.muc) ? (tc.diem || 0) + "đ" : "";
  };

  // Sắp xếp tiêu chí (giữ nguyên)
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

  // Hàm tính tổng được tham số hóa
  function calcTotalForSection(maChaLon: string, role: 'student' | 'classPresident') {
    const values = role === 'student' ? studentSelectedValues : classPresidentSelectedValues;
    const section = tieuChiList.find((tc) => tc._ma === maChaLon);
    const maxTotal = section?.diem || 0;

    const calculateRecursive = (parentId: string): number => {
      let sum = 0;
      const children = tieuChiList.filter((tc) => (tc._maCha ?? "") === parentId);

      children.forEach((child) => {
        let currentScore = 0;
        if (child.loai_tieu_chi === "Textbox") {
          const rawVal = values[child.muc]?.[0];
          const count = rawVal ? parseInt(rawVal) : 0;
          if (count && !isNaN(count)) {
            currentScore = count * (child.diem || 0);
          }
        } else {
          const group = child._maCha || child.muc;
          const selected = values[group] || [];
          if (selected.includes(child.muc)) {
            currentScore = child.diem || 0;
          }
        }
        sum += currentScore + calculateRecursive(child._ma || "");
      });
      return sum;
    };

    const rawTotal = calculateRecursive(maChaLon);
    const finalTotal = Math.min(rawTotal, maxTotal);
    return { finalTotal, maxTotal };
  }

  const calcAllTotal = (role: 'student' | 'classPresident') => {
    const rootSections = tieuChiList.filter((tc) => (tc._maCha ?? "") === "");
    const totalScore = rootSections.reduce((sum, section) => {
      const { finalTotal } = calcTotalForSection(section._ma || "", role);
      return sum + finalTotal;
    }, 0);
    return totalScore;
  };

  const getRank = (role: 'student' | 'classPresident') => {
    const total = calcAllTotal(role);
    const cappedTotal = Math.min(total, 100);
    
    if (cappedTotal >= 90) return "Xuất sắc";
    if (cappedTotal >= 80) return "Giỏi";
    if (cappedTotal >= 65) return "Khá";
    if (cappedTotal >= 50) return "Trung bình";
    return "Yếu";
  };

  const handleSave = () => {
    // 1. Tính toán tổng điểm và xếp loại của lớp trưởng
    const tongDiemLopTruong = Math.min(calcAllTotal('classPresident'), 100);
    const xepLoaiLopTruong = getRank('classPresident');

    // 2. Tạo danh sách điểm chi tiết theo định dạng API yêu cầu
    const danhsachdieminput = tieuChiList.map(tc => {
      let diemSo = 0;
      if (tc.loai_tieu_chi === "Textbox") {
        const rawVal = classPresidentSelectedValues[tc.muc]?.[0];
        const count = rawVal ? parseInt(rawVal) : 0;
        if (count && !isNaN(count)) {
          diemSo = count * (tc.diem || 0);
        }
      } else {
        const group = tc._maCha || tc.muc;
        const selected = classPresidentSelectedValues[group] || [];
        if (selected.includes(tc.muc)) {
          diemSo = tc.diem || 0;
        }
      }
      
      return {
        ma_sinh_vien_diem_ren_luyen_chi_tiet: tc.ma_sinh_vien_diem_ren_luyen_chi_tiet,
        diem_lop_truong_danh_gia: diemSo,
        // Các trường khác không cần thiết cho vai trò này
        diem_sinh_vien_danh_gia: 0,
        diem_giang_vien_danh_gia: 0,
        diem_truong_khoa_danh_gia: 0,
        diem_chuyen_vien_dao_tao: 0,
      };
    });

    // 3. Tạo payload hoàn chỉnh
    const payload = {
      type: "loptruong",
      tong_diem: tongDiemLopTruong,
      danhsachdieminput: danhsachdieminput,
    };

    // 4. Gọi API để lưu điểm
    fetch("http://localhost:8080/api/chamdiem", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(err => { throw new Error(err.message || "Lưu điểm thất bại") });
      }
      return res.json();
    })
    .then(data => {
      alert("Lưu điểm thành công!");
      // Tùy chọn: Tự động quay về trang danh sách sau khi lưu
      router.push('/students/xemdssinhvien');
    })
    .catch(error => {
      console.error("Lỗi khi lưu điểm:", error);
      alert(error.message || "Đã có lỗi xảy ra khi lưu điểm.");
    });
  }

  return (
    <div className="bangdiem_students-container">
      <h2>Bảng điểm rèn luyện - Lớp trưởng đánh giá</h2>

      <table className="bangdiem_students-table">
        <thead>
          <tr>
            <th>Mục</th>
            <th>Nội dung</th>
            <th>Mô tả</th>
            <th>Số Điểm</th>
            <th>Hành động</th>
            <th>Điểm Sinh Viên</th>
            <th>Điểm Lớp trưởng</th>
          </tr>
        </thead>
        <tbody>
          {(() => {
            const sorted = sortBangDiem(tieuChiList);
            const rows: JSX.Element[] = [];
            let currentSectionMa = "";
            let currentSectionLabel = "";

            sorted.forEach((tc, idx) => {
              const isBig = (tc._maCha ?? "") === "";
              if (isBig) {
                currentSectionMa = tc._ma || "";
                currentSectionLabel = tc.muc;
              }

              const diemBackend = tc.diem > 0 ? `+${tc.diem}` : tc.diem < 0 ? `${tc.diem}` : "0";
              
              // Lấy giá trị đã chọn của lớp trưởng để hiển thị trên input
              const classPresidentSelected = classPresidentSelectedValues[tc._maCha || tc.muc] || [];
              const isClassPresidentSelected = classPresidentSelected.includes(tc.muc);

              rows.push(
                <tr key={tc.ma_sinh_vien_diem_ren_luyen_chi_tiet}>
                  <td style={{ fontWeight: isBig ? "bold" : "normal" }}>{tc.muc}</td>
                  <td style={{ fontWeight: isBig ? "bold" : "normal" }}>{tc.ten_tieu_chi}</td>
                  <td>{tc.mo_ta_diem || ""}</td>
                  <td style={{ fontWeight: "bold" }}>{diemBackend}</td>
                  <td>
                    {tc.loai_tieu_chi === "None" && <span>_</span>}
                    {tc.loai_tieu_chi === "Checkbox" && (
                      <input type="checkbox" checked={isClassPresidentSelected} onChange={() => handleCheckbox(tc)} />
                    )}
                    {tc.loai_tieu_chi === "Radio" && (
                      <input
                        type="radio"
                        name={tc._maCha || tc.muc}
                        checked={isClassPresidentSelected}
                        onChange={() => handleRadio(tc)}
                      />
                    )}
                    {tc.loai_tieu_chi === "Textbox" && (
                      <input
                        type="number"
                        min={0}
                        max={tc.so_lan > 0 ? tc.so_lan : undefined}
                        step={1}
                        className="textbox-input"
                        value={classPresidentSelectedValues[tc.muc]?.[0] ?? 0}
                        onChange={(e) => handleTextbox(tc, e.target.value)}
                      />
                    )}
                  </td>
                  <td style={{ fontWeight: "bold" }}>{getDiemTieuChi(tc, 'student')}</td>
                  <td style={{ fontWeight: "bold" }}>{getDiemTieuChi(tc, 'classPresident')}</td>
                </tr>
              );

              const nextTc = sorted[idx + 1];
              const isNextNewSection = nextTc && (nextTc._maCha ?? "") === "";
              const isEndOfList = !nextTc;

              if (isNextNewSection || isEndOfList) {
                const studentSection = calcTotalForSection(currentSectionMa, 'student');
                const classPresidentSection = calcTotalForSection(currentSectionMa, 'classPresident');
                
                rows.push(
                  <tr key={`total-${currentSectionMa}`} className="section-total">
                    <td colSpan={5} className="total-label">
                      Tổng điểm mục {currentSectionLabel} (Tối đa: {studentSection.maxTotal}đ)
                    </td>
                    <td className="total-value">{studentSection.finalTotal}</td>
                    <td className="total-value loptruong-score">{classPresidentSection.finalTotal}</td>
                  </tr>
                );
              }
            });

            const studentGrandTotal = Math.min(calcAllTotal('student'), 100);
            const classPresidentGrandTotal = Math.min(calcAllTotal('classPresident'), 100);

            rows.push(
              <tr className="all-total" key="all-total">
                <td colSpan={5} className="total-label">Tổng cộng</td>
                <td className="total-value grand-total">{studentGrandTotal}</td>
                <td className="total-value grand-total loptruong-score">{classPresidentGrandTotal}</td>
              </tr>
            );

            rows.push(
              <tr className="rank-row" key="rank-row">
                <td colSpan={5} className="total-label">Xếp loại</td>
                <td className="total-value">{getRank('student')}</td>
                <td className="total-value loptruong-score">{getRank('classPresident')}</td>
              </tr>
            );

            return rows;
          })()}
        </tbody>
      </table>

      <div className="bangdiem_students-buttons">
        <button onClick={handleSave} className="bangdiem_students-btn">
          Lưu
        </button>
      </div>
    </div>
  );
}