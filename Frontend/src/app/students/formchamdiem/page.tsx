"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "./../../styles/students/bangchamdiem.css";

type BackendDiem = {
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
  xep_loai: string;
};

const bigSections = ["I", "II", "III", "IV", "V"];
const maxPoints: Record<string, number> = {
  I: 20,
  II: 25,
  III: 20,
  IV: 25,
  V: 10,
};

export default function ChamDiem() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [criteria, setCriteria] = useState<BackendDiem[]>([]);
  const [selectedValues, setSelectedValues] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);

  // Fetch tiêu chí và điểm đã chấm từ backend
  useEffect(() => {
  // Lấy học kỳ từ session
  const sessionStr = localStorage.getItem("session");
  let maHocKy = "";
  if (sessionStr) {
    const session = JSON.parse(sessionStr);
    maHocKy = session.ma_hoc_ky || "";
  }

  // Tạo key theo mẫu: bangdiem_<ma_hoc_ky>_BD
  const key = `bangdiem_${maHocKy}_BD`;
  const bangDiemStr = localStorage.getItem(key);

  if (bangDiemStr) {
    try {
      const bangDiemData = JSON.parse(bangDiemStr);

      // Gán dữ liệu hiển thị ra form
      setCriteria(bangDiemData);
    } catch (error) {
      console.error("Không thể parse dữ liệu bảng điểm:", error);
    }
  } else {
    console.warn("Không tìm thấy dữ liệu bảng điểm trong localStorage");
  }

  setLoading(false);

  // Lấy mã bảng điểm chấm từ query params (hoặc thay bằng nguồn phù hợp)
  const mabangdiemcham = searchParams.get("mabangdiemcham") || "";

  if (mabangdiemcham) {
    fetch(`http://localhost:8080/tieuchi/xemtieuchivadiemdacham/${mabangdiemcham}`)
      .then((res) => res.json())
      .then((data) => {
        const arr: BackendDiem[] = Array.isArray(data) ? data : data.danh_sach_tieu_chi || [];
        setCriteria(arr);

        // Map dữ liệu đã chấm thành selectedValues
        const selected: Record<string, string[]> = {};
        arr.forEach((item) => {
          if (item.loai_tieu_chi === "Checkbox" && item.diem_sinh_vien_danh_gia) {
            selected[item.muc] = [item.muc];
          }
          if (item.loai_tieu_chi === "Radio" && item.diem_sinh_vien_danh_gia) {
            selected[item.ma_tieu_chi_cha] = [item.muc];
          }
          if (
            (item.loai_tieu_chi === "Textbox" || item.loai_tieu_chi === "Counter") &&
            item.diem_sinh_vien_danh_gia
          ) {
            selected[item.muc] = [String(item.diem_sinh_vien_danh_gia)];
          }
        });
        setSelectedValues(selected);
      })
      .catch((err) => {
        console.error("Lỗi khi fetch dữ liệu đã chấm:", err);
      })
      .finally(() => setLoading(false));
  } else {
    console.warn("Không tìm thấy tham số mabangdiemcham, bỏ qua fetch dữ liệu đã chấm");
  }
  }, [searchParams]);

  // Lưu nháp
  function handleCopy() {
    const saveData = { selectedValues };
    localStorage.setItem("luuNhapBangDiem", JSON.stringify(saveData));
    alert("Đã lưu nháp thành công!");
    router.push(`/students/formchamdiem/luunhap`);
  }

  // Gửi bảng điểm
  function handleCreate() {
    localStorage.setItem("guiBangDiem", JSON.stringify({ selectedValues }));
    alert("Bạn đã gửi bảng điểm thành công, quay lại trang chủ ?");
    router.push(`/students`);
  }

  // Xếp loại
  const getRank = () => {
    const total = calcAllTotal();
    if (total >= 90) return "Xuất sắc";
    if (total >= 80) return "Giỏi";
    if (total >= 65) return "Khá";
    if (total >= 50) return "Trung bình";
    return "Yếu";
  };

  // Xử lý tick checkbox
  const handleCheckbox = (item: BackendDiem) => {
    setSelectedValues((prev) => {
      const group = item.muc;
      const current = prev[group] || [];
      if (current.includes(item.muc)) {
        return { ...prev, [group]: current.filter((v) => v !== item.muc) };
      } else {
        return { ...prev, [group]: [...current, item.muc] };
      }
    });
  };

  // Xử lý radio
  const handleRadio = (item: BackendDiem) => {
    const group = item.ma_tieu_chi_cha;
    setSelectedValues((prev) => ({
      ...prev,
      [group]: [item.muc],
    }));
  };

  // Xử lý textbox/counter
  const handleCounter = (item: BackendDiem, value: string) => {
    setSelectedValues((prev) => ({
      ...prev,
      [item.muc]: [value],
    }));
  };

  // Tính tổng điểm của section với giới hạn
  const calcSectionTotal = (section: string) => {
    const sectionItems = criteria.filter(
      (item) =>
        item.muc === section ||
        item.ma_tieu_chi_cha === section ||
        criteria.find((d) => d.muc === item.ma_tieu_chi_cha)?.ma_tieu_chi_cha === section
    );

    const total = sectionItems.reduce((sum, item) => {
      if (item.loai_tieu_chi === "Textbox" || item.loai_tieu_chi === "Counter") {
        const rawVal = selectedValues[item.muc]?.[0];
        const count = rawVal ? parseInt(rawVal) : 0;
        if (!count || isNaN(count)) return sum;
        return sum + count * (item.diem || 0);
      }
      if (item.loai_tieu_chi === "Checkbox") {
        const selected = selectedValues[item.muc] || [];
        if (selected.includes(item.muc)) {
          return sum + (item.diem || 0);
        }
      }
      if (item.loai_tieu_chi === "Radio") {
        const selected = selectedValues[item.ma_tieu_chi_cha] || [];
        if (selected.includes(item.muc)) {
          return sum + (item.diem || 0);
        }
      }
      return sum;
    }, 0);

    // giới hạn điểm tối đa
    return Math.min(total, maxPoints[section] || total);
  };

  // Tổng toàn bảng = tổng đã giới hạn
  const calcAllTotal = () => {
    return bigSections.reduce((sum, section) => sum + calcSectionTotal(section), 0);
  };

  // Chuyển loại tiêu chí thành ký hiệu và input tương ứng
  function renderActionInput(item: BackendDiem) {
    switch (item.loai_tieu_chi) {
      case "None":
        return <span>-</span>;
      case "Checkbox":
        return (
          <input
            type="checkbox"
            checked={!!selectedValues[item.muc]}
            onChange={() => handleCheckbox(item)}
          />
        );
      case "Radio":
        return (
          <input
            type="radio"
            name={item.ma_tieu_chi_cha}
            checked={!!selectedValues[item.ma_tieu_chi_cha]?.includes(item.muc)}
            onChange={() => handleRadio(item)}
          />
        );
      case "Textbox":
      case "Counter":
        return (
          <input
            type="number"
            min={0}
            max={10}
            step={1}
            value={selectedValues[item.muc]?.[0] || ""}
            onChange={(e) => handleCounter(item, e.target.value)}
            style={{ width: 60 }}
          />
        );
      default:
        return <span>-</span>;
    }
  }

  console.log("criteria:", criteria);

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
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
            <th>Hành động</th>
            <th>Sinh viên tự đánh giá</th>
          </tr>
        </thead>
        <tbody>
          {bigSections.map((section) => {
            const sectionItems = criteria.filter(
              (item) =>
                item.muc === section ||
                item.ma_tieu_chi_cha === section ||
                criteria.find((d) => d.muc === item.ma_tieu_chi_cha)?.ma_tieu_chi_cha === section
            );

            return (
              <React.Fragment key={section}>
                {sectionItems.map((item, index) => {
                  const isBig = bigSections.includes(item.muc);
                  let isSelected = false;
                  if (item.loai_tieu_chi === "Checkbox") {
                    isSelected = !!selectedValues[item.muc];
                  }
                  if (item.loai_tieu_chi === "Radio") {
                    isSelected = !!selectedValues[item.ma_tieu_chi_cha]?.includes(item.muc);
                  }
                  if (item.loai_tieu_chi === "Textbox" || item.loai_tieu_chi === "Counter") {
                    isSelected = !!selectedValues[item.muc]?.[0];
                  }

                  return (
                    <tr
                      key={`${section}-${index}`}
                      className={isBig ? "big-section" : ""}
                    >
                      <td style={{ fontWeight: isBig ? "bold" : "normal" }}>
                        {item.muc}
                      </td>
                      <td style={{ fontWeight: isBig ? "bold" : "normal" }}>
                        {item.ten_tieu_chi}
                      </td>
                      <td>{item.mo_ta_diem || ""}</td>
                      <td>{renderActionInput(item)}</td>
                      <td style={{ fontWeight: "bold" }}>
                        {(item.loai_tieu_chi === "Textbox" || item.loai_tieu_chi === "Counter")
                          ? (() => {
                              const rawVal = selectedValues[item.muc]?.[0];
                              const count = rawVal ? parseInt(rawVal) : 0;
                              if (!count || isNaN(count)) return "";
                              const diemMoiLan = item.diem || 0;
                              return count * diemMoiLan + "đ";
                            })()
                          : isSelected
                          ? item.diem + "đ"
                          : ""}
                      </td>
                    </tr>
                  );
                })}
                <tr className="section-total">
                  <td colSpan={4} style={{ fontWeight: "bold" }}>
                    Tổng điểm {section}
                  </td>
                  <td style={{ fontWeight: "bold" }}>
                    {calcSectionTotal(section)}
                  </td>
                </tr>
              </React.Fragment>
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
