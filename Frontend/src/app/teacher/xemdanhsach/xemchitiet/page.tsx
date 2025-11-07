"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { diemData } from "../../../admin/data";
import "../../../styles/teachers/xemchitiet.css";
import { useSearchParams } from "next/navigation";

export default function XemChiTiet() {
  const router = useRouter();
  const bigSections = ["I", "II", "III", "IV", "V"];
  const [bcsSelectedValues, setBcsSelectedValues] = useState<
    Record<string, string[]>
  >({});
  const [cvSelectedValues, setCvSelectedValues] = useState<
    Record<string, string[]>
  >({});

  // giới hạn điểm tối đa cho từng mục lớn
  const maxPoints: Record<string, number> = {
    I: 20,
    II: 25,
    III: 20,
    IV: 25,
    V: 10,
  };
  const searchParams = useSearchParams();
  const studentId = searchParams.get("id") || "default";

  const [selectedValues, setSelectedValues] = useState<
    Record<string, string[]>
  >({});
  const [bcsScores, setBcsScores] = useState<Record<string, string>>({}); // 🔹 lưu điểm BCS

  // 🔹 load dữ liệu đã lưu từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem("guiBangDiem");
    if (saved) {
      const parsed = JSON.parse(saved);
      setSelectedValues(parsed.selectedValues || {});
    }
  }, []);

  // 🔹 mỗi khi selectedValues thay đổi → auto gán điểm BCS = điểm SV
  useEffect(() => {
    const saved = localStorage.getItem("guiBangDiem");
    if (saved) {
      const parsed = JSON.parse(saved);
      const svSelected = parsed.selectedValues || {};
      setSelectedValues(svSelected);

      // 🔹 mặc định BCS chọn giống SV
      setBcsSelectedValues(svSelected);
      // 🔹 mặc định Cố vấn chọn giống SV
      setCvSelectedValues(svSelected);
    }
  }, []);

  //Xếp loại
  const getRanksv = () => {
    const total = calcAllTotalSV();
    if (total >= 90) return "Xuất sắc";
    if (total >= 80) return "Giỏi";
    if (total >= 65) return "Khá";
    if (total >= 50) return "Trung bình";
    return "Yếu";
  };
  const getRankbcs = () => {
    const total = calcAllTotalBCS();
    if (total >= 90) return "Xuất sắc";
    if (total >= 80) return "Giỏi";
    if (total >= 65) return "Khá";
    if (total >= 50) return "Trung bình";
    return "Yếu";
  };
  const getRankcv = () => {
    const total = calcAllTotalCV();
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
      const score = parseInt(bcsScores[item.muc] || "0");
      return sum + (isNaN(score) ? 0 : score);
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
    return bigSections.reduce(
      (sum, section) => sum + calcSectionTotalBCS(section),
      0
    );
  };
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
    return bigSections.reduce(
      (sum, section) => sum + calcSectionTotalCV(section),
      0
    );
  };
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
    return bigSections.reduce(
      (sum, section) => sum + calcSectionTotalSV(section),
      0
    );
  };
  const handleback = () => {
    alert("Bạn có chắc chắn muốn trả lại bảng điểm?");
    router.push("/teacher/xemdanhsach");
  };

  return (
    <div className="xemchitiet_students-container">
      <h2>Xem lại bảng điểm đánh giá</h2>
      <table className="xemchitiet_students-table">
        <thead>
          <tr>
            <th>Mục</th>
            <th>Nội dung đánh giá</th>
            <th>Mô tả</th>
            <th>Người dùng chọn</th>
            <th>Điểm sinh viên đánh giá</th>
            <th>Điểm ban cán sự đánh giá</th>
            <th>Cố vấn chọn</th>
            <th>Điểm cố vấn đánh giá</th>
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

                  // Điểm SV
                  let svScore = "";
                  if (item.loai === "counter") {
                    const rawVal = selectedValues[item.muc]?.[0];
                    const count = rawVal ? parseInt(rawVal) : 0;
                    if (count && !isNaN(count)) {
                      const diemMoiLan = parseInt(item.diem ?? "0");
                      svScore = String(count * diemMoiLan);
                    }
                  } else if (isSelected) {
                    svScore = item.diem ?? "";
                  }

                  return (
                    <tr>
                      <td>{item.muc}</td>
                      <td>{item.noiDung}</td>
                      <td>{item.diem || ""}</td>
                      <td>
                        {/* Người dùng chọn */}
                        {item.loai === "checkbox" && (
                          <input
                            type="checkbox"
                            checked={isSelected}
                            disabled
                          />
                        )}
                        {item.loai === "radio" && (
                          <input
                            type="radio"
                            name={item.mucCha}
                            checked={isSelected}
                            disabled
                          />
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
                      {/* Điểm BCS - hiển thị trực tiếp từ bcsSelectedValues */}
                      <td style={{ fontWeight: "bold" }}>
                        {item.loai === "counter"
                          ? (() => {
                              const rawVal = bcsSelectedValues[item.muc]?.[0];
                              const count = rawVal ? parseInt(rawVal) : 0;
                              if (!count || isNaN(count)) return "";
                              const diemMoiLan = parseInt(item.diem ?? "0");
                              return count * diemMoiLan + "đ";
                            })()
                          : bcsSelectedValues[
                              item.mucCha || item.muc
                            ]?.includes(item.muc)
                          ? item.diem
                          : ""}
                      </td>
                      {/* Cố vấn chọn */}
                      <td>
                        {item.loai === "checkbox" && (
                          <input
                            type="checkbox"
                            checked={
                              cvSelectedValues[
                                item.mucCha || item.muc
                              ]?.includes(item.muc) || false
                            }
                            onChange={(e) => {
                              setCvSelectedValues((prev) => {
                                const group = item.mucCha || item.muc;
                                const current = prev[group] || [];
                                if (e.target.checked) {
                                  return {
                                    ...prev,
                                    [group]: [...current, item.muc],
                                  };
                                } else {
                                  return {
                                    ...prev,
                                    [group]: current.filter(
                                      (v) => v !== item.muc
                                    ),
                                  };
                                }
                              });
                            }}
                          />
                        )}

                        {item.loai === "radio" && (
                          <input
                            type="radio"
                            name={`cv-${item.mucCha}`}
                            checked={
                              cvSelectedValues[item.mucCha || ""]?.includes(
                                item.muc
                              ) || false
                            }
                            onChange={() => {
                              setCvSelectedValues((prev) => ({
                                ...prev,
                                [item.mucCha || ""]: [item.muc],
                              }));
                            }}
                          />
                        )}

                        {item.loai === "counter" && (
                          <input
                            type="number"
                            value={cvSelectedValues[item.muc]?.[0] || ""}
                            onChange={(e) => {
                              setCvSelectedValues((prev) => ({
                                ...prev,
                                [item.muc]: [e.target.value],
                              }));
                            }}
                            style={{ width: "60px" }}
                          />
                        )}
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
                          : cvSelectedValues[
                              item.mucCha || item.muc
                            ]?.includes(item.muc)
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
                    {calcSectionTotalSV(section)} {/* tổng điểm SV */}
                  </td>
                  <td style={{ fontWeight: "bold" }}>
                    {calcSectionTotalBCS(section)} {/* tổng điểm BCS */}
                  </td>
                  <td></td>
                  <td style={{ fontWeight: "bold" }}>
                    {calcSectionTotalCV(section)} {/* tổng điểm Cố vấn */}
                  </td>
                </tr>
              </React.Fragment>
            );
          })}
          <tr className="all-total">
            <td colSpan={4} style={{ fontWeight: "bold" }}>
              Tổng điểm
            </td>
            <td style={{ fontWeight: "bold" }}>{calcAllTotalSV()}</td>
            <td style={{ fontWeight: "bold" }}>{calcAllTotalBCS()}</td>
            <td></td>
            <td style={{ fontWeight: "bold" }}>{calcAllTotalCV()}</td>
          </tr>

          <tr className="rank-row">
            <td colSpan={4} style={{ fontWeight: "bold" }}>
              Xếp loại
            </td>
            <td style={{ fontWeight: "bold" }}>{getRanksv()}</td>
            <td style={{ fontWeight: "bold" }}>{getRankbcs()}</td>
            <td></td>
            <td style={{ fontWeight: "bold" }}>{getRankcv()}</td>
          </tr>
        </tbody>
      </table>

      <div className="xemchitiet_students-buttons">
        <button onClick={handleback} className="xemchitiet_students-btn">
          Trả lại bảng điểm
        </button>
        <button
          onClick={() => {
            // Tính tổng điểm BCS và CV hiện tại
            const totalBCS = calcAllTotalBCS();
            const totalCV = calcAllTotalCV();

            // Lấy dữ liệu cũ trong localStorage (nếu có)
            const saved = localStorage.getItem("bangDiemBCS");
            let data = saved ? JSON.parse(saved) : {};

            // Cập nhật điểm BCS và CV cho sinh viên đang xem
            // Lấy id sinh viên từ searchParams
            const studentId = searchParams.get("id") || "default";

            data[studentId] = {
              diemBCS: totalBCS,
              bcsSelectedValues,
              diemCV: totalCV,
              cvSelectedValues,
            };

            // Lưu lại
            localStorage.setItem("bangDiemBCS", JSON.stringify(data));

            alert("Bạn đã lưu bảng điểm thành công!");
            router.push("/teacher/xemdssinhvien");
            
          }}
          className="xemchitiet_students-btn"
        >
          Lưu bảng điểm
        </button>
      </div>
    </div>
  );
}
