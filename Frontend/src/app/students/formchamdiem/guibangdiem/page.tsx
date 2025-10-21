"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { diemData, Diem } from "../../../admin/data";
import "../../../styles/students/bangchamdiem.css";

export default function GuiBangDiem() {
  const router = useRouter();
  const bigSections = ["I", "II", "III", "IV", "V"];

  // giới hạn điểm tối đa cho từng mục lớn
  const maxPoints: Record<string, number> = {
    I: 20,
    II: 25,
    III: 20,
    IV: 25,
    V: 10,
  };

  const [selectedValues, setSelectedValues] = useState<
    Record<string, string[]>
  >({});

  // 🔹 load dữ liệu đã lưu từ localStorage
 useEffect(() => {
  const saved = localStorage.getItem("guiBangDiem");
  if (saved) {
    const parsed = JSON.parse(saved);
    setSelectedValues(parsed.selectedValues || {});
  }
}, []);


  //Xếp loại
  const getRank = () => {
    const total = calcAllTotal();
    if (total >= 90) return "Xuất sắc";
    if (total >= 80) return "Giỏi";
    if (total >= 65) return "Khá";
    if (total >= 50) return "Trung bình";
    return "Yếu";
  };

  // tính tổng điểm của section với giới hạn
  const calcSectionTotal = (section: string) => {
    const sectionItems = diemData.filter(
      (item) =>
        item.muc === section ||
        item.mucCha === section ||
        diemData.find((d) => d.muc === item.mucCha)?.mucCha === section
    );

    const total = sectionItems.reduce((sum, item) => {
      if (item.loai === "counter") {
        const rawVal = selectedValues[item.muc]?.[0];
        const count = rawVal ? parseInt(rawVal) : 0;
        if (!count || isNaN(count)) return sum;
        return sum + count * (parseInt(item.diem ?? "0") || 0);
      }

      const group = item.mucCha || item.muc;
      const selected = selectedValues[group] || [];
      if (selected.includes(item.muc)) {
        return sum + (parseInt(item.diem ?? "0") || 0);
      }
      return sum;
    }, 0);

    return Math.min(total, maxPoints[section] || total);
  };

  // tổng toàn bảng
  const calcAllTotal = () => {
    return bigSections.reduce(
      (sum, section) => sum + calcSectionTotal(section),
      0
    );
  };

  return (
    <div className="bangdiem_students-container">
      <h2>Xem lại bảng điểm đánh giá</h2>
      <table className="bangdiem_students-table">
        <thead>
          <tr>
            <th>Mục</th>
            <th>Nội dung đánh giá</th>
            <th>Mô tả</th>
            <th>Người dùng chọn</th>
            <th>Điểm</th>
          </tr>
        </thead>
        <tbody>
          {bigSections.map((section) => {
            const sectionItems = diemData.filter(
              (item) =>
                item.muc === section ||
                item.mucCha === section ||
                diemData.find((d) => d.muc === item.mucCha)?.mucCha === section
            );

            return (
              <React.Fragment key={section}>
                {sectionItems.map((item, index) => {
                  const isBig = bigSections.includes(item.muc);
                  const group = item.mucCha || item.muc;
                  const selected = selectedValues[group] || [];
                  const isSelected = selected.includes(item.muc);

                  return (
                    <tr
                      key={`${section}-${index}`}
                      className={isBig ? "big-section" : ""}
                    >
                      <td style={{ fontWeight: isBig ? "bold" : "normal" }}>
                        {item.muc}
                      </td>
                      <td style={{ fontWeight: isBig ? "bold" : "normal" }}>
                        {item.noiDung}
                      </td>
                      <td>{item.diem || ""}</td>
                      <td>
                        {item.loai === "checkbox" && (
                          <input type="checkbox" checked={isSelected} disabled />
                        )}
                        {item.loai === "radio" && (
                          <input
                            type="radio"
                            name={item.mucCha}
                            checked={isSelected}
                            disabled
                          />
                        )}
                        {item.loai === "none" && <span>-</span>}
                        {item.loai === "counter" && (
                          <span>{selectedValues[item.muc]?.[0] || 0}</span>
                        )}
                      </td>
                      <td style={{ fontWeight: "bold" }}>
                        {item.loai === "counter"
                          ? (() => {
                              const rawVal = selectedValues[item.muc]?.[0];
                              const count = rawVal ? parseInt(rawVal) : 0;
                              if (!count || isNaN(count)) return "";
                              const diemMoiLan = parseInt(item.diem ?? "0");
                              return count * diemMoiLan + "đ";
                            })()
                          : isSelected
                          ? item.diem
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
        <button
          onClick={() => router.push("/students")}
          className="bangdiem_students-btn"
        >
          Quay lại
        </button>
      </div>
    </div>
  );
}
