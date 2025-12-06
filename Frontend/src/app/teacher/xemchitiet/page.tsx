"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "./../../styles/teachers/xemchitiet.css";

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
  diem_giang_vien_danh_gia: number; 
  diem_truong_khoa_danh_gia: number;
  diem_chuyen_vien_dao_tao: number;
  _ma?: string;
  _maCha?: string;
};

export default function ChamDiemGiaoVien() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [masinhvien, setMasinhvien] = useState("");
  const [mahocky, setMahocky] = useState("");
  const [tieuChiList, setTieuChiList] = useState<TieuChi[]>([]);
  const [studentName, setStudentName] = useState("");
  const [userRole, setUserRole] = useState(""); 

  const [editableSelectedValues, setEditableSelectedValues] = useState<Record<string, any>>({});

  function getCode(id?: string | null): string {
    if (!id) return "";
    return id.includes("~") ? id.split("~")[1] : id;
  }
  const getParentCode = (id?: string | null) => {
      const code = getCode(id);
      return code === "0" ? "" : code; 
  };

  useEffect(() => {
    const hoTen = searchParams.get("hoten");
    if (hoTen) {
      setStudentName(decodeURIComponent(hoTen));
    }
  }, [searchParams]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sessionRaw = localStorage.getItem("session") || "{}";
    let session: any = {};
    try { session = JSON.parse(sessionRaw); } catch { session = {}; }
    const role = session?.type || ""; 
    setUserRole(role);

    const maSV = searchParams.get("masv") || searchParams.get("masinhvien");
    const maHK = searchParams.get("mahocky");

    if (maSV) setMasinhvien(maSV);
    if (maHK) setMahocky(maHK);
  }, [searchParams]);

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

        const initialEditableValues: Record<string, any> = {};

        const parseValueToState = (tc: TieuChi, diemSo: number) => {
          if (diemSo <= 0) return; 
          
          if (tc.loai_tieu_chi === "Textbox" && tc.diem > 0) {
            const soLan = Math.round(diemSo / tc.diem);
            initialEditableValues[tc.muc] = [soLan.toString()];
          } else if (["Checkbox", "Radio"].includes(tc.loai_tieu_chi)) {
            const group = tc._maCha || tc.muc;
            const current = initialEditableValues[group] || [];
            if (!current.includes(tc.muc)) {
              initialEditableValues[group] = [...current, tc.muc];
            }
          }
        };

        // 1. Xác định trường dữ liệu của vai trò hiện tại
        let currentRoleField = '';
        if (userRole === 'giangvien') currentRoleField = 'diem_giang_vien_danh_gia';
        else if (userRole === 'truongkhoa') currentRoleField = 'diem_truong_khoa_danh_gia';
        else if (userRole === 'chuyenviendaotao') currentRoleField = 'diem_chuyen_vien_dao_tao';

        // 2. Kiểm tra xem đã từng chấm chưa
        const daChamDiem = danhSach.some((tc: any) => (tc[currentRoleField] || 0) > 0);

        danhSach.forEach((tc) => {
           let diemInit = 0;

           if (daChamDiem) {
               // ĐÃ CHẤM: Lấy đúng điểm của mình
               if (userRole === 'giangvien') diemInit = tc.diem_giang_vien_danh_gia;
               else if (userRole === 'truongkhoa') diemInit = tc.diem_truong_khoa_danh_gia;
               else if (userRole === 'chuyenviendaotao') diemInit = tc.diem_chuyen_vien_dao_tao;
           } else {
               // CHƯA CHẤM: Lấy điểm cấp trước làm gợi ý
               if (userRole === 'giangvien') {
                   diemInit = tc.diem_lop_truong_danh_gia;
               } else if (userRole === 'truongkhoa') {
                   diemInit = tc.diem_giang_vien_danh_gia;
               } else if (userRole === 'chuyenviendaotao') {
                   diemInit = tc.diem_truong_khoa_danh_gia;
               }
           }
           parseValueToState(tc, diemInit);
        });

        setEditableSelectedValues(initialEditableValues);
      })
      .catch((err) => console.error("Lỗi fetch:", err));
  }, [masinhvien, mahocky, userRole]); 

  const handleCheckbox = (tc: TieuChi) => {
    const group = tc._maCha || tc.muc;
    setEditableSelectedValues((prev) => {
      const current = prev[group] || [];
      return current.includes(tc.muc)
        ? { ...prev, [group]: current.filter((v: string) => v !== tc.muc) }
        : { ...prev, [group]: [...current, tc.muc] };
    });
  };

  const handleRadio = (tc: TieuChi) => {
    const group = tc._maCha || tc.muc;
    setEditableSelectedValues((prev) => ({ ...prev, [group]: [tc.muc] }));
  };

  const handleTextbox = (tc: TieuChi, value: string) => {
    if (value === "") {
      setEditableSelectedValues((prev) => ({ ...prev, [tc.muc]: [""] }));
      return;
    }
    let numValue = parseInt(value, 10);
    if (isNaN(numValue)) return;

    const max = (tc.so_lan && tc.so_lan > 0) ? tc.so_lan : 999;

    if (numValue > max) numValue = max;
    if (numValue < 0) numValue = 0;

    setEditableSelectedValues((prev) => ({ ...prev, [tc.muc]: [numValue.toString()] }));
  };

  const getDiemHienThi = (tc: TieuChi, roleTarget: string) => {
    if (roleTarget === 'editable') {
      const values = editableSelectedValues;
      if (tc.loai_tieu_chi === "Textbox") {
        const rawVal = values[tc.muc]?.[0];
        const count = rawVal ? parseInt(rawVal) : 0;
        return (count && !isNaN(count)) ? (count * (tc.diem || 0)) + "đ" : "";
      }
      const group = tc._maCha || tc.muc;
      return (values[group] || []).includes(tc.muc) ? (tc.diem || 0) + "đ" : "";
    }

    let val = 0;
    if (roleTarget === 'sv') val = tc.diem_sinh_vien_danh_gia;
    else if (roleTarget === 'lt') val = tc.diem_lop_truong_danh_gia;
    else if (roleTarget === 'cv') val = tc.diem_giang_vien_danh_gia;
    else if (roleTarget === 'tk') val = tc.diem_truong_khoa_danh_gia;
    else if (roleTarget === 'pdt') val = tc.diem_chuyen_vien_dao_tao;

    return val > 0 ? val + "đ" : "";
  };

  const getDiemSoOnly = (tc: TieuChi, roleTarget: string) => {
      const str = getDiemHienThi(tc, roleTarget);
      return str ? parseInt(str.replace('đ', '')) : 0;
  }

  function sortBangDiem(data: TieuChi[]) {
    const romanOrder = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
    const numberOrder = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    const letterOrder = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    const chaLon = data
      .filter((item) => !item._maCha || item._maCha === "") 
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

  const calcTotalForSection = (maChaLon: string, roleTarget: string) => {
    const section = tieuChiList.find((tc) => tc._ma === maChaLon);
    const maxTotal = section?.diem || 0;
    const calculateRecursive = (parentId: string): number => {
      let sum = 0;
      const children = tieuChiList.filter((tc) => (tc._maCha ?? "") === parentId);
      children.forEach((child) => {
        sum += getDiemSoOnly(child, roleTarget) + calculateRecursive(child._ma || "");
      });
      return sum;
    };
    const rawTotal = calculateRecursive(maChaLon);
    return { finalTotal: Math.min(rawTotal, maxTotal), maxTotal };
  };

  const calcAllTotal = (roleTarget: string) => {
    const rootSections = tieuChiList.filter((tc) => !tc._maCha || tc._maCha === "");
    return rootSections.reduce((sum, section) => sum + calcTotalForSection(section._ma || "", roleTarget).finalTotal, 0);
  };

  const getRank = (roleTarget: string) => {
    const total = Math.min(calcAllTotal(roleTarget), 100);
    if (total >= 90) return "Xuất sắc";
    if (total >= 80) return "Giỏi";
    if (total >= 65) return "Khá";
    if (total >= 50) return "Trung bình";
    return "Yếu";
  };

  const renderActionInput = (tc: TieuChi) => {
    const group = tc._maCha || tc.muc;
    const isSelected = (editableSelectedValues[group] || []).includes(tc.muc);

    if (tc.loai_tieu_chi === "Radio") {
      return <input type="radio" name={group} checked={isSelected} onChange={() => handleRadio(tc)} />;
    }
    if (tc.loai_tieu_chi === "Checkbox") {
      return <input type="checkbox" checked={isSelected} onChange={() => handleCheckbox(tc)} />;
    }
    if (tc.loai_tieu_chi === "Textbox") {
      const rawValue = editableSelectedValues[tc.muc]?.[0];
      const value = rawValue !== undefined ? rawValue : "0";

      return (
        <input 
            type="number" 
            min="0" 
            max={(tc.so_lan && tc.so_lan > 0) ? tc.so_lan : undefined}
            step="1"
            value={value} 
            onChange={(e) => handleTextbox(tc, e.target.value)} 
            className="textbox-input" 
            style={{width: '60px', textAlign: 'center'}}
        />
      );
    }
    return tc.loai_tieu_chi === "None" ? <span>_</span> : null;
  };

  const handleSave = () => {
    const apiType = userRole === 'giangvien' ? 'giangvien' : 
                    userRole === 'truongkhoa' ? 'truongkhoa' : 
                    userRole === 'chuyenviendaotao' ? 'chuyenviendaotao' : ''; 
    
    if(!apiType) {
        alert("Vai trò không hợp lệ để lưu điểm.");
        return;
    }

    const tongDiem = Math.min(calcAllTotal('editable'), 100);

    const danhsachdieminput = tieuChiList.map((tc) => {
      const diemSo = getDiemSoOnly(tc, 'editable');
      const itemPayload: any = {
        ma_sinh_vien_diem_ren_luyen_chi_tiet: tc.ma_sinh_vien_diem_ren_luyen_chi_tiet,
        diem_sinh_vien_danh_gia: 0,
        diem_lop_truong_danh_gia: 0,
        diem_giang_vien_danh_gia: 0,
        diem_truong_khoa_danh_gia: 0,
        diem_chuyen_vien_dao_tao: 0
      };

      if (apiType === 'giangvien') itemPayload.diem_giang_vien_danh_gia = diemSo;
      else if (apiType === 'truongkhoa') itemPayload.diem_truong_khoa_danh_gia = diemSo;
      else if (apiType === 'chuyenviendaotao') itemPayload.diem_chuyen_vien_dao_tao = diemSo;

      return itemPayload;
    });

    console.log("Sending data:", { type: apiType, tong_diem: tongDiem });

    fetch("http://localhost:8080/api/chamdiem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: apiType, tong_diem: tongDiem, danhsachdieminput }),
    })
    .then(async (res) => {
        const isJson = res.headers.get("content-type")?.includes("application/json");
        const data = isJson ? await res.json() : null;

        if (!res.ok) {
            const error = (data && data.message) || res.statusText;
            return Promise.reject(error);
        }
        return data || {};
    })
    .then(() => { 
        alert("Lưu thành công!"); 
        router.back();
    })
    .catch((err) => { 
        console.error("Lỗi khi lưu:", err); 
        alert("Lỗi lưu điểm: " + (err.toString() || "Không xác định")); 
    });
  };

  return (
    <div className="bangdiem_students-container">
      <h2>Đánh giá rèn luyện: {studentName}</h2>

      <table className="bangdiem_students-table">
        <thead>
          <tr>
            <th>Mục</th>
            <th>Nội dung</th>
            <th>Mô tả</th>
            <th>Số điểm</th>
            <th>Điểm SV</th>
            <th>Điểm Lớp trưởng</th>

            {userRole === 'giangvien' && <th>Hành động</th>}
            {(userRole === 'giangvien' || userRole === 'truongkhoa' || userRole === 'chuyenviendaotao') && <th>Điểm Cố vấn</th>}

            {userRole === 'truongkhoa' && <th>Hành động</th>}
            {(userRole === 'truongkhoa' || userRole === 'chuyenviendaotao') && <th>Điểm Trưởng Khoa</th>}

            {userRole === 'chuyenviendaotao' && <th>Hành động</th>}
            {userRole === 'chuyenviendaotao' && <th>Điểm P.Đào tạo</th>}
          </tr>
        </thead>
        <tbody>
          {(() => {
            const sorted = sortBangDiem(tieuChiList);
            if(sorted.length === 0) return <tr><td colSpan={10}>Đang tải dữ liệu...</td></tr>

            const rows: JSX.Element[] = [];
            let currentSectionMa = "";
            let currentSectionLabel = "";

            sorted.forEach((tc, idx) => {
              const isBig = !tc._maCha || tc._maCha === "";
              if (isBig) {
                currentSectionMa = tc._ma || "";
                currentSectionLabel = tc.muc;
              }
              const diemMaxStr = tc.diem > 0 ? `+${tc.diem}` : tc.diem < 0 ? `${tc.diem}` : "0";

              rows.push(
                <tr key={tc.ma_sinh_vien_diem_ren_luyen_chi_tiet}>
                  <td style={{ fontWeight: isBig ? "bold" : "normal" }}>{tc.muc}</td>
                  <td style={{ fontWeight: isBig ? "bold" : "normal" }}>{tc.ten_tieu_chi}</td>
                  <td>{tc.mo_ta_diem}</td>
                  <td style={{ fontWeight: "bold" }}>{diemMaxStr}</td>
                  
                  {/* Điểm Cố Định */}
                  <td>{getDiemHienThi(tc, 'sv')}</td>
                  <td style={{ fontWeight: "bold" }}>{getDiemHienThi(tc, 'lt')}</td>

                  {/* 1. GIẢNG VIÊN */}
                  {userRole === 'giangvien' && <td>{renderActionInput(tc)}</td>}
                  {(userRole === 'giangvien' || userRole === 'truongkhoa' || userRole === 'chuyenviendaotao') && (
                      <td style={{ fontWeight: "bold" }}>
                         {userRole === 'giangvien' ? getDiemHienThi(tc, 'editable') : getDiemHienThi(tc, 'cv')}
                      </td>
                  )}

                  {/* 2. TRƯỞNG KHOA */}
                  {userRole === 'truongkhoa' && <td>{renderActionInput(tc)}</td>}
                  {(userRole === 'truongkhoa' || userRole === 'chuyenviendaotao') && (
                      <td style={{ fontWeight: "bold" }}>
                         {userRole === 'truongkhoa' ? getDiemHienThi(tc, 'editable') : getDiemHienThi(tc, 'tk')}
                      </td>
                  )}

                  {/* 3. CHUYÊN VIÊN */}
                  {userRole === 'chuyenviendaotao' && <td>{renderActionInput(tc)}</td>}
                  {userRole === 'chuyenviendaotao' && (
                      <td style={{ fontWeight: "bold" }}>{getDiemHienThi(tc, 'editable')}</td>
                  )}
                </tr>
              );

              // TỔNG KẾT MỤC LỚN
              const nextTc = sorted[idx + 1];
              const isNextNewSection = nextTc && (!nextTc._maCha || nextTc._maCha === "");
              const isEndOfList = !nextTc;

              if (isNextNewSection || isEndOfList) {
                const svTotal = calcTotalForSection(currentSectionMa, 'sv');
                const ltTotal = calcTotalForSection(currentSectionMa, 'lt');
                
                rows.push(
                  <tr key={`total-${currentSectionMa}`} className="section-total">
                    <td colSpan={4} className="total-label">Tổng điểm mục {currentSectionLabel} (Tối đa: {svTotal.maxTotal})</td>
                    <td className="total-value">{svTotal.finalTotal}</td>
                    <td className="total-value">{ltTotal.finalTotal}</td>

                    {/* Tổng GV */}
                    {userRole === 'giangvien' && <td></td>}
                    {(userRole === 'giangvien' || userRole === 'truongkhoa' || userRole === 'chuyenviendaotao') && (
                       <td className="total-value">
                         {userRole === 'giangvien' ? calcTotalForSection(currentSectionMa, 'editable').finalTotal : calcTotalForSection(currentSectionMa, 'cv').finalTotal}
                       </td>
                    )}

                    {/* Tổng TK */}
                    {userRole === 'truongkhoa' && <td></td>}
                    {(userRole === 'truongkhoa' || userRole === 'chuyenviendaotao') && (
                       <td className="total-value">
                         {userRole === 'truongkhoa' ? calcTotalForSection(currentSectionMa, 'editable').finalTotal : calcTotalForSection(currentSectionMa, 'tk').finalTotal}
                       </td>
                    )}

                    {/* Tổng Chuyên viên */}
                    {userRole === 'chuyenviendaotao' && <td></td>}
                    {userRole === 'chuyenviendaotao' && <td className="total-value">{calcTotalForSection(currentSectionMa, 'editable').finalTotal}</td>}
                  </tr>
                );
              }
            });

            // TỔNG CỘNG TOÀN BỘ
            const totalSV = Math.min(calcAllTotal('sv'), 100);
            const totalLT = Math.min(calcAllTotal('lt'), 100);
            const totalCV = Math.min(calcAllTotal(userRole==='giangvien'?'editable':'cv'), 100);
            const totalTK = Math.min(calcAllTotal(userRole==='truongkhoa'?'editable':'tk'), 100);
            const totalPDT = Math.min(calcAllTotal('editable'), 100);

            rows.push(
               <tr key="grand-total" className="all-total">
                   <td colSpan={4} className="total-label">Tổng Cộng</td>
                   <td className="grand-total">{totalSV}</td>
                   <td className="grand-total">{totalLT}</td>

                   {userRole === 'giangvien' && <td></td>}
                   {(userRole === 'giangvien' || userRole === 'truongkhoa' || userRole === 'chuyenviendaotao') && 
                      <td className="grand-total">{totalCV}</td>
                   }

                   {userRole === 'truongkhoa' && <td></td>}
                   {(userRole === 'truongkhoa' || userRole === 'chuyenviendaotao') && 
                      <td className="grand-total">{totalTK}</td>
                   }

                   {userRole === 'chuyenviendaotao' && <td></td>}
                   {userRole === 'chuyenviendaotao' && <td className="grand-total">{totalPDT}</td>}
               </tr>
            );

            // XẾP LOẠI
            rows.push(
                <tr key="rank" className="rank-row">
                    <td colSpan={4} className="total-label">Xếp loại</td>
                    <td className="total-value">{getRank('sv')}</td>
                    <td className="total-value">{getRank('lt')}</td>

                    {userRole === 'giangvien' && <td></td>}
                    {(userRole === 'giangvien' || userRole === 'truongkhoa' || userRole === 'chuyenviendaotao') && 
                       <td className="total-value">{userRole==='giangvien'?getRank('editable'):getRank('cv')}</td>
                    }

                    {userRole === 'truongkhoa' && <td></td>}
                    {(userRole === 'truongkhoa' || userRole === 'chuyenviendaotao') && 
                       <td className="total-value">{userRole==='truongkhoa'?getRank('editable'):getRank('tk')}</td>
                    }

                    {userRole === 'chuyenviendaotao' && <td></td>}
                    {userRole === 'chuyenviendaotao' && <td className="total-value">{getRank('editable')}</td>}
                </tr>
            );

            return rows;
          })()}
        </tbody>
      </table>

      { (userRole === 'giangvien' || userRole === 'truongkhoa' || userRole === 'chuyenviendaotao') && (
        <div className="bangdiem_students-buttons">
          <button onClick={handleSave} className="bangdiem_students-btn">Lưu kết quả</button>
        </div>
      )}
    </div>
  );
}