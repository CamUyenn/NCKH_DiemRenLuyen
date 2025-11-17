"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { diemData } from "../../../../admin/data";
import "../../../../styles/teachers/xemchitiet.css";

export default function TruongKhoaXemChiTietSinhVien() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bigSections = ["I", "II", "III", "IV", "V"];

  const classId = searchParams.get("classId") || "1";
  const studentId = searchParams.get("studentId") || "default";

  const [selectedValues, setSelectedValues] = useState<Record<string, string[]>>({});
  const [bcsSelectedValues, setBcsSelectedValues] = useState<Record<string, string[]>>({});
  const [cvSelectedValues, setCvSelectedValues] = useState<Record<string, string[]>>({});
  const [khoaSelectedValues, setKhoaSelectedValues] = useState<Record<string, string[]>>({});

  // giới hạn điểm tối đa cho từng mục lớn
  const maxPoints: Record<string, number> = {
    I: 20,
    II: 25,
    III: 20,
    IV: 25,
    V: 10,
  };

  // Load dữ liệu từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem("guiBangDiem");
    if (saved) {
      const parsed = JSON.parse(saved);
      setSelectedValues(parsed.selectedValues || {});
    }

    const savedBCS = localStorage.getItem("bangDiemBCS");
    if (savedBCS) {
      const parsed = JSON.parse(savedBCS);
      if (parsed[studentId]) {
        setBcsSelectedValues(parsed[studentId].bcsSelectedValues || {});
        setCvSelectedValues(parsed[studentId].cvSelectedValues || {});
      }
    }

    // Load Khoa scores if available
    const savedKhoa = localStorage.getItem(`khoaScores_${classId}`);
    if (savedKhoa) {
      const parsed = JSON.parse(savedKhoa);
      // For now, use the same structure as CV
      setKhoaSelectedValues(parsed[studentId]?.khoaSelectedValues || {});
    }
  }, [studentId, classId]);

  // Tính điểm SV
  const calcSectionTotalSV = (section: string) => {
    const sectionItems = diemData.filter(
      (item) =>
        item.muc === section ||
        item.mucCha === section ||
        diemData.find((d) => d.muc === item.mucCha)?.mucCha === section
    );

    const total = sectionItems.reduce((sum, item) => {
      let score = 0;
      if (item.loai === "counter") {
        const rawVal = selectedValues[item.muc]?.[0];
        const count = rawVal ? parseInt(rawVal) : 0;
        const diemMoiLan = parseInt(item.diem ?? "0");
        score = count * diemMoiLan;
      } else {
        const selected = selectedValues[item.mucCha || item.muc] || [];
        if (selected.includes(item.muc)) {
          score = parseInt(item.diem ?? "0");
        }
      }
      return sum + (isNaN(score) ? 0 : score);
    }, 0);

    return Math.min(total, maxPoints[section] || total);
  };

  const calcAllTotalSV = () => {
    return bigSections.reduce((sum, section) => sum + calcSectionTotalSV(section), 0);
  };

  // Tính điểm BCS
  const calcSectionTotalBCS = (section: string) => {
    const sectionItems = diemData.filter(
      (item) =>
        item.muc === section ||
        item.mucCha === section ||
        diemData.find((d) => d.muc === item.mucCha)?.mucCha === section
    );

    const total = sectionItems.reduce((sum, item) => {
      let score = 0;
      if (item.loai === "counter") {
        const rawVal = bcsSelectedValues[item.muc]?.[0];
        const count = rawVal ? parseInt(rawVal) : 0;
        const diemMoiLan = parseInt(item.diem ?? "0");
        score = count * diemMoiLan;
      } else {
        const selected = bcsSelectedValues[item.mucCha || item.muc] || [];
        if (selected.includes(item.muc)) {
          score = parseInt(item.diem ?? "0");
        }
      }
      return sum + (isNaN(score) ? 0 : score);
    }, 0);

    return Math.min(total, maxPoints[section] || total);
  };

  const calcAllTotalBCS = () => {
    return bigSections.reduce((sum, section) => sum + calcSectionTotalBCS(section), 0);
  };

  // Tính điểm Cố vấn
  const calcSectionTotalCV = (section: string) => {
    const sectionItems = diemData.filter(
      (item) =>
        item.muc === section ||
        item.mucCha === section ||
        diemData.find((d) => d.muc === item.mucCha)?.mucCha === section
    );

    const total = sectionItems.reduce((sum, item) => {
      let score = 0;
      if (item.loai === "counter") {
        const rawVal = cvSelectedValues[item.muc]?.[0];
        const count = rawVal ? parseInt(rawVal) : 0;
        const diemMoiLan = parseInt(item.diem ?? "0");
        score = count * diemMoiLan;
      } else {
        const selected = cvSelectedValues[item.mucCha || item.muc] || [];
        if (selected.includes(item.muc)) {
          score = parseInt(item.diem ?? "0");
        }
      }
      return sum + (isNaN(score) ? 0 : score);
    }, 0);

    return Math.min(total, maxPoints[section] || total);
  };

  const calcAllTotalCV = () => {
    return bigSections.reduce((sum, section) => sum + calcSectionTotalCV(section), 0);
  };

  // Tính điểm Khoa
  const calcSectionTotalKhoa = (section: string) => {
    const sectionItems = diemData.filter(
      (item) =>
        item.muc === section ||
        item.mucCha === section ||
        diemData.find((d) => d.muc === item.mucCha)?.mucCha === section
    );

    const total = sectionItems.reduce((sum, item) => {
      let score = 0;
      if (item.loai === "counter") {
        const rawVal = khoaSelectedValues[item.muc]?.[0];
        const count = rawVal ? parseInt(rawVal) : 0;
        const diemMoiLan = parseInt(item.diem ?? "0");
        score = count * diemMoiLan;
      } else {
        const selected = khoaSelectedValues[item.mucCha || item.muc] || [];
        if (selected.includes(item.muc)) {
          score = parseInt(item.diem ?? "0");
        }
      }
      return sum + (isNaN(score) ? 0 : score);
    }, 0);

    return Math.min(total, maxPoints[section] || total);
  };

  const calcAllTotalKhoa = () => {
    return bigSections.reduce((sum, section) => sum + calcSectionTotalKhoa(section), 0);
  };

  // Xếp loại
  const getRank = (total: number) => {
    if (total >= 90) return "Xuất sắc";
    if (total >= 80) return "Giỏi";
    if (total >= 65) return "Khá";
    if (total >= 50) return "Trung bình";
    return "Yếu";
  };

  const handleBack = () => {
    router.push(`/teacher/truongkhoa/xemdanhsachlop/xemchitietlop?id=${classId}`);
  };

  return (
    <div className="xemchitiet_students-container">
      <h2>Xem chi tiết bảng điểm đánh giá</h2>
      <table className="xemchitiet_students-table">
        <thead>
          <tr>
            <th>Mục</th>
            <th>Nội dung đánh giá</th>
            <th>Mô tả</th>
            <th>Người dùng chọn</th>
            <th>Điểm SV</th>
            <th>Điểm BCS</th>
            <th>Điểm Cố vấn</th>
            <th>Điểm Khoa</th>
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
                {sectionItems.map((item) => {
                  const group = item.mucCha || item.muc;
                  const selected = selectedValues[group] || [];
                  const isSelected = selected.includes(item.muc);

                  return (
                    <tr key={item.muc}>
                      <td>{item.muc}</td>
                      <td>{item.noiDung}</td>
                      <td>{item.diem || ""}</td>
                      <td>
                        {item.loai === "checkbox" && (
                          <input type="checkbox" checked={isSelected} disabled />
                        )}
                        {item.loai === "radio" && (
                          <input type="radio" name={item.mucCha} checked={isSelected} disabled />
                        )}
                        {item.loai === "counter" && (
                          <span>{selectedValues[item.muc]?.[0] || 0}</span>
                        )}
                      </td>
                      {/* Điểm SV */}
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
                      {/* Điểm BCS */}
                      <td style={{ fontWeight: "bold" }}>
                        {item.loai === "counter"
                          ? (() => {
                              const rawVal = bcsSelectedValues[item.muc]?.[0];
                              const count = rawVal ? parseInt(rawVal) : 0;
                              if (!count || isNaN(count)) return "";
                              const diemMoiLan = parseInt(item.diem ?? "0");
                              return count * diemMoiLan + "đ";
                            })()
                          : bcsSelectedValues[item.mucCha || item.muc]?.includes(item.muc)
                          ? item.diem
                          : ""}
                      </td>
                      {/* Điểm Cố vấn */}
                      <td style={{ fontWeight: "bold" }}>
                        {item.loai === "counter"
                          ? (() => {
                              const rawVal = cvSelectedValues[item.muc]?.[0];
                              const count = rawVal ? parseInt(rawVal) : 0;
                              if (!count || isNaN(count)) return "";
                              const diemMoiLan = parseInt(item.diem ?? "0");
                              return count * diemMoiLan + "đ";
                            })()
                          : cvSelectedValues[item.mucCha || item.muc]?.includes(item.muc)
                          ? item.diem
                          : ""}
                      </td>
                      {/* Điểm Khoa */}
                      <td style={{ fontWeight: "bold" }}>
                        {item.loai === "counter"
                          ? (() => {
                              const rawVal = khoaSelectedValues[item.muc]?.[0];
                              const count = rawVal ? parseInt(rawVal) : 0;
                              if (!count || isNaN(count)) return "";
                              const diemMoiLan = parseInt(item.diem ?? "0");
                              return count * diemMoiLan + "đ";
                            })()
                          : khoaSelectedValues[item.mucCha || item.muc]?.includes(item.muc)
                          ? item.diem
                          : ""}
                      </td>
                    </tr>
                  );
                })}
                {/* Tổng điểm section */}
                <tr className="section-total">
                  <td colSpan={4} style={{ fontWeight: "bold" }}>
                    Tổng điểm {section}
                  </td>
                  <td style={{ fontWeight: "bold" }}>{calcSectionTotalSV(section)}</td>
                  <td style={{ fontWeight: "bold" }}>{calcSectionTotalBCS(section)}</td>
                  <td style={{ fontWeight: "bold" }}>{calcSectionTotalCV(section)}</td>
                  <td style={{ fontWeight: "bold" }}>{calcSectionTotalKhoa(section)}</td>
                </tr>
              </React.Fragment>
            );
          })}
          {/* Tổng điểm toàn bộ */}
          <tr className="all-total">
            <td colSpan={4} style={{ fontWeight: "bold" }}>
              Tổng điểm
            </td>
            <td style={{ fontWeight: "bold" }}>{calcAllTotalSV()}</td>
            <td style={{ fontWeight: "bold" }}>{calcAllTotalBCS()}</td>
            <td style={{ fontWeight: "bold" }}>{calcAllTotalCV()}</td>
            <td style={{ fontWeight: "bold" }}>{calcAllTotalKhoa()}</td>
          </tr>
          {/* Xếp loại */}
          <tr className="rank-row">
            <td colSpan={4} style={{ fontWeight: "bold" }}>
              Xếp loại
            </td>
            <td style={{ fontWeight: "bold" }}>{getRank(calcAllTotalSV())}</td>
            <td style={{ fontWeight: "bold" }}>{getRank(calcAllTotalBCS())}</td>
            <td style={{ fontWeight: "bold" }}>{getRank(calcAllTotalCV())}</td>
            <td style={{ fontWeight: "bold" }}>{getRank(calcAllTotalKhoa())}</td>
          </tr>
        </tbody>
      </table>

      <div className="xemchitiet_students-buttons">
        <button onClick={handleBack} className="xemchitiet_students-btn">
          Quay lại
        </button>
      </div>
    </div>
  );
}
