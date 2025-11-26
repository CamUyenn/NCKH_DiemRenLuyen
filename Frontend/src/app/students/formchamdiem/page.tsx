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
  diem_sinh_vien_danh_gia: number; // Thêm trường này
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

  // Fetch API
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
        // Khởi tạo selectedValues từ dữ liệu đã có
        const initialSelectedValues: Record<string, any> = {};
        danhSach.forEach((tc) => {
          if (tc.loai_tieu_chi === "Textbox") {
            if (tc.diem_sinh_vien_danh_gia > 0 && tc.diem > 0) {
              const soLanDaNhap = tc.diem_sinh_vien_danh_gia / tc.diem;
              // Làm tròn để xử lý các trường hợp số lẻ nếu có
              const soLanLamTron = Math.round(soLanDaNhap);
              initialSelectedValues[tc.muc] = [soLanLamTron.toString()];
            }
          } else if (tc.loai_tieu_chi === "Checkbox" || tc.loai_tieu_chi === "Radio") {
            // Nếu là checkbox/radio và có điểm > 0
            if (tc.diem_sinh_vien_danh_gia > 0) {
              const group = tc._maCha || tc.muc;
              const current = initialSelectedValues[group] || [];
              initialSelectedValues[group] = [...current, tc.muc];
            }
          }
        });
        setSelectedValues(initialSelectedValues);
      })
      .catch((err) => {
        console.error("Lỗi khi fetch tiêu chí:", err);
        setTieuChiList([]);
      });
  }, [masinhvien, mahocky]);

  function handleCopy() {
    if (typeof window === "undefined") return;

    // Chuẩn bị dữ liệu theo định dạng mà API chamdiem.go yêu cầu
    const danhsachdieminput = tieuChiList.map(tc => {
      let diemSo = 0;
      
      if (tc.loai_tieu_chi === "Textbox") {
        const rawVal = selectedValues[tc.muc]?.[0];
        const count = rawVal ? parseInt(rawVal) : 0;
        if (count && !isNaN(count)) {
          diemSo = count * (tc.diem || 0);
        }
      } else {
        const group = tc._maCha || tc.muc;
        const selected = selectedValues[group] || [];
        if (selected.includes(tc.muc)) {
          diemSo = tc.diem || 0;
        }
      }

      return {
        ma_sinh_vien_diem_ren_luyen_chi_tiet: tc.ma_sinh_vien_diem_ren_luyen_chi_tiet,
        diem_sinh_vien_danh_gia: diemSo,
        // Các trường điểm khác không cần thiết cho vai trò sinh viên
        diem_lop_truong_danh_gia: 0,
        diem_giang_vien_danh_gia: 0,
        diem_truong_khoa_danh_gia: 0,
        diem_chuyen_vien_dao_tao: 0,
      };
    });

    const payload = {
      type: "sinhvien",
      danhsachdieminput: danhsachdieminput,
    };

    // Gọi API chấm điểm để lưu nháp
    fetch("http://localhost:8080/api/chamdiem", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => { throw new Error(err.message || "Lưu nháp thất bại") });
        }
        return res.json();
      })
      .then(data => {
        alert("Lưu nháp thành công!");
         window.location.reload();
      })
      .catch(error => {
        console.error("Lỗi khi lưu nháp:", error);
        alert(error.message || "Đã có lỗi xảy ra khi lưu nháp.");
      });
  }

  function handleCreate() {
    if (typeof window === "undefined" || !masinhvien || !mahocky) return;

    const tongDiem = Math.min(calcAllTotal(), 100);
    const xepLoai = getRank();

    // Chuẩn bị mảng điểm chi tiết để gửi lên server
    const diemChiTiet = tieuChiList
      .map(tc => {
        let diemSo = 0;
        let soLan = null;
        let daTuongTac = false;

        if (tc.loai_tieu_chi === "Textbox") {
          const rawVal = selectedValues[tc.muc]?.[0];
          const count = rawVal ? parseInt(rawVal) : 0;
          if (count > 0 && !isNaN(count)) {
            diemSo = count * (tc.diem || 0);
            soLan = count;
            daTuongTac = true;
          }
        } else if (tc.loai_tieu_chi === "Checkbox" || tc.loai_tieu_chi === "Radio") {
          const group = tc._maCha || tc.muc;
          const selected = selectedValues[group] || [];
          if (selected.includes(tc.muc)) {
            diemSo = tc.diem || 0;
            daTuongTac = true;
          }
        }

        // Chỉ gửi những tiêu chí mà sinh viên đã tương tác
        if (daTuongTac) {
          return {
            ma_sinh_vien_diem_ren_luyen_chi_tiet: tc.ma_sinh_vien_diem_ren_luyen_chi_tiet,
            diem_sinh_vien_danh_gia: diemSo,
            so_lan: soLan,
          };
        }
        return null;
      })
      .filter(Boolean); // Lọc bỏ các giá trị null

    const payload = {
      ma_sinh_vien: masinhvien,
      ma_hoc_ky: mahocky,
      tong_diem: tongDiem,
      xep_loai: xepLoai,
      diem_chi_tiet: diemChiTiet,
    };

    // Gọi API để nộp bảng điểm và thay đổi trạng thái
    fetch("http://localhost:8080/api/thaydoitrangthai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(res => {
        if (!res.ok) {
          // Nếu có lỗi, thử đọc thông báo lỗi từ server
          return res.json().then(err => { throw new Error(err.message || "Nộp bảng điểm thất bại") });
        }
        return res.json();
      })
      .then(data => {
        alert("Nộp bảng điểm thành công!");
        // Xóa bản nháp đã lưu ở local sau khi nộp thành công
        localStorage.removeItem("luuNhapBangDiem");
        // Chuyển về trang dashboard của sinh viên
        router.push("/students");
      })
      .catch(error => {
        console.error("Lỗi khi nộp bảng điểm:", error);
        alert(error.message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
      });
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
  // Tính tổng điểm cho từng mục lớn với giới hạn điểm
  function calcTotalForSection(maChaLon: string) {
    // Tìm mục lớn (I, II...) để lấy điểm tối đa (maxTotal)
    const section = tieuChiList.find((tc) => tc._ma === maChaLon);
    const maxTotal = section?.diem || 0;

    // Hàm đệ quy tính tổng điểm thực tế 
    const calculateRecursive = (parentId: string): number => {
      let sum = 0;
      const children = tieuChiList.filter((tc) => (tc._maCha ?? "") === parentId);

      children.forEach((child) => {
        let currentScore = 0;
        if (child.loai_tieu_chi === "Textbox") {
          const rawVal = selectedValues[child.muc]?.[0];
          const count = rawVal ? parseInt(rawVal) : 0;
          if (count && !isNaN(count)) {
            currentScore = count * (child.diem || 0);
          }
        } else {
          // Checkbox/Radio/None
          const group = child._maCha || child.muc;
          const selected = selectedValues[group] || [];
          if (selected.includes(child.muc)) {
            currentScore = child.diem || 0;
          }
        }
        // Cộng điểm bản thân + đệ quy
        sum += currentScore + calculateRecursive(child._ma || "");
      });
      return sum;
    };

    const rawTotal = calculateRecursive(maChaLon);

    // Nếu tổng thực tế > điểm tối đa thì lấy điểm tối đa
    // Ví dụ: rawTotal = 25, maxTotal = 20 => finalTotal = 20
    const finalTotal = Math.min(rawTotal, maxTotal);

    return { rawTotal, finalTotal, maxTotal };
  }

  // LOGIC MỚI: Tính tổng toàn bài dựa trên các mục lớn ĐÃ BỊ GIỚI HẠN
  const calcAllTotal = () => {
    // 1. Lấy tất cả các mục lớn (I, II, III...) (có _maCha rỗng)
    const rootSections = tieuChiList.filter((tc) => (tc._maCha ?? "") === "");

    // 2. Duyệt qua từng mục lớn, tính điểm đã giới hạn (finalTotal) rồi cộng lại
    const totalScore = rootSections.reduce((sum, section) => {
      const { finalTotal } = calcTotalForSection(section._ma || "");
      return sum + finalTotal;
    }, 0);

    return totalScore;
  };

  const getRank = () => {
    const total = calcAllTotal();
    // Tổng tối đa toàn bài không quá 100 (đề phòng)
    const cappedTotal = Math.min(total, 100);
    
    if (cappedTotal >= 90) return "Xuất sắc";
    if (cappedTotal >= 80) return "Giỏi";
    if (cappedTotal >= 65) return "Khá";
    if (cappedTotal >= 50) return "Trung bình";
    return "Yếu";
  };

  return (
    <div className="bangdiem_students-container">
      <h2>Bảng điểm rèn luyện</h2>

      <table className="bangdiem_students-table">
        <thead>
          <tr>
            <th>Mục</th>
            <th>Nội dung</th>
            <th>Mô tả</th>
            <th>Số Điểm</th>
            <th>Hành động</th>
            <th>Điểm Sinh Viên</th>
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

              const group = tc._maCha || tc.muc;
              const selected = selectedValues[group] || [];
              const isSelected = selected.includes(tc.muc);

              const diemBackend =
                tc.diem > 0 ? `+${tc.diem}` : tc.diem < 0 ? `${tc.diem}` : "0";

              rows.push(
                <tr key={tc.ma_sinh_vien_diem_ren_luyen_chi_tiet}>
                  <td style={{ fontWeight: isBig ? "bold" : "normal" }}>{tc.muc}</td>
                  <td style={{ fontWeight: isBig ? "bold" : "normal" }}>{tc.ten_tieu_chi}</td>
                  <td>{tc.mo_ta_diem || ""}</td>
                  <td style={{ fontWeight: "bold" }}>{diemBackend}</td>
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
                        max={tc.so_lan > 0 ? tc.so_lan : undefined}
                        step={1}
                        className="textbox-input"
                        value={selectedValues[tc.muc]?.[0] ?? 0}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          // Nếu có giới hạn số lần và nhập quá thì cảnh báo
                          if (tc.so_lan > 0 && val > tc.so_lan) {
                            alert(`Số lần tối đa cho tiêu chí này là ${tc.so_lan}`);
                            setSelectedValues((prev) => ({ ...prev, [tc.muc]: [tc.so_lan] }));
                          } else {
                            handleTextbox(tc, e.target.value);
                          }
                        }}
                      />
                    )}
                  </td>
                  <td style={{ fontWeight: "bold" }}>{getDiemTieuChi(tc)}</td>
                </tr>
              );

              // Xử lý hiển thị dòng TỔNG ĐIỂM MỤC
              const nextTc = sorted[idx + 1];
              const isNextNewSection = nextTc && (nextTc._maCha ?? "") === "";
              const isEndOfList = !nextTc;

              if (isNextNewSection || isEndOfList) {
                const { finalTotal, maxTotal } = calcTotalForSection(currentSectionMa);
                
                rows.push(
                  <tr key={`total-${currentSectionMa}`} className="section-total">
                    <td colSpan={5} style={{
                      fontWeight: "bold",
                      background: "#f0f0f0",
                      textAlign: "center"
                    }}>
                      Tổng điểm mục {currentSectionLabel} (Tối đa: {maxTotal}đ)
                    </td>
                    <td style={{
                      fontWeight: "bold",
                      background: "#f0f0f0",
                      textAlign: "center",
                      color: "black"
                    }}>
                      {/* Đây là nơi hiển thị điểm đã bị giới hạn (ví dụ: 20 / 20 dù chọn 25) */}
                      {finalTotal} 
                    </td>
                  </tr>
                );
              }
            });

            // Tổng điểm toàn bộ (Đã tính theo logic giới hạn từng mục)
            const grandTotal = calcAllTotal();
            const cappedGrandTotal = Math.min(grandTotal, 100);

            rows.push(
              <tr className="all-total" key="all-total">
                <td colSpan={5} style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  background: "#f9f9f9"
                }}>
                  Tổng cộng
                </td>
                <td style={{
                  fontWeight: "bold",
                  fontSize: '1.2em',
                  background: "#f9f9f9",
                  textAlign: "center",
                  color: "black"
                }}>
                  {cappedGrandTotal}
                </td>
              </tr>
            );

            rows.push(
              <tr className="rank-row" key="rank-row">
                <td colSpan={5} style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  background: "#f9f9f9"
                }}>
                  Xếp loại
                </td>
                <td style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  background: "#f9f9f9",
                  color: "black"
                }}>
                  {getRank()}
                </td>
              </tr>
            );

            return rows;
          })()}
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