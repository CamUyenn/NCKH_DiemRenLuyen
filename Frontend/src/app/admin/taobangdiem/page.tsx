"use client";

import "./../../styles/Admin/TaoBangDiem.css";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

interface RowData {
  level: string; // Mức
  mucCha?: string; // Mức cha
  section: string; // Mục
  type: string;
  content: string;
  score: string;
}

// Các danh sách mục theo level
const mucLevel1 = ["I", "II", "III", "IV", "V", "VI"];
const mucLevel2 = ["1", "2", "3", "4", "5", "6", "7", "8"];
const mucLevel3 = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "k"];

const levels = ["1", "2", "3"];
const types = ["Checkbox", "Radio", "None"];

const GroupedCriteriaTable: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const raw = searchParams.get("raw");

  const [rows, setRows] = useState<RowData[]>([
    { level: "", section: "", type: "", content: "", score: "" },
  ]);

  const handleChange = (index: number, field: keyof RowData, value: string) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);

    // Khi dòng cuối đã nhập đủ thì thêm dòng mới
    if (
      index === rows.length - 1 &&
      updatedRows[index].level &&
      (updatedRows[index].level === "1" || updatedRows[index].mucCha) &&
      updatedRows[index].section &&
      updatedRows[index].type &&
      updatedRows[index].content
    ) {
      setRows([
        ...updatedRows,
        {
          level: "",
          section: "",
          type: "",
          content: "",
          score: "",
        },
      ]);
    }
  };

  const handleThemBangDiem = () => {
    // Lọc bỏ các hàng rỗng
    const validRows = rows.filter(
      (row) => row.level && row.section && row.type && row.content && row.score
    );
    const converted = validRows.map((row) => ({
      muc: row.section,
      mucLevel: parseInt(row.level, 10),
      mucCha: row.mucCha || "",
      loai: row.type,
      noiDung: row.content,
      diem: row.score,
    }));

    localStorage.setItem(`bangdiem_${raw}`, JSON.stringify(converted));
    router.push(`/admin/dataobangdiem?raw=${raw}`);
  };

  const getMucOptions = (level: string) => {
    if (level === "1") return mucLevel1;
    if (level === "2") return mucLevel2;
    if (level === "3") return mucLevel3;
    return [];
  };

  const getMucChaOptions = (level: string) => {
    if (level === "2")
      return rows.filter((r) => r.level === "1").map((r) => r.section);
    if (level === "3")
      return rows.filter((r) => r.level === "2").map((r) => r.section);
    return [];
  };

  return (
    <div className="bangdiem-container">
      <h2 className="bangdiem-title">Bảng tiêu chí đánh giá</h2>

      <table className="bangdiem-table">
        <thead>
          <tr>
            <th className="bangdiem-th">Mức</th>
            <th className="bangdiem-th">Mức cha</th>
            <th className="bangdiem-th">Mục</th>
            <th className="bangdiem-th">Loại tiêu chí</th>
            <th className="bangdiem-th">Nội dung tiêu chí</th>
            <th className="bangdiem-th">Điểm</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item, index) => {
            const mucLevel = item.level;

            return (
              <tr key={index} className="bangdiem-tr">
                {/* Mức */}
                <td className="bangdiem-td">
                  <select
                    value={item.level}
                    onChange={(e) =>
                      handleChange(index, "level", e.target.value)
                    }
                    className="bangdiem-select"
                  >
                    <option value="">-- Chọn mức --</option>
                    {levels.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Mức cha */}
                <td className="bangdiem-td">
                  <select
                    value={item.mucCha || ""}
                    onChange={(e) =>
                      handleChange(index, "mucCha", e.target.value)
                    }
                    className="bangdiem-select"
                    disabled={mucLevel === "1"} // ✅ mức 1 thì không chọn cha
                  >
                    <option value="">-- Chọn mức cha --</option>
                    {getMucChaOptions(mucLevel).map((mc, i) => (
                      <option key={i} value={mc}>
                        {mc}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Mục */}
                <td className="bangdiem-td">
                  <select
                    value={item.section}
                    onChange={(e) =>
                      handleChange(index, "section", e.target.value)
                    }
                    className="bangdiem-select"
                    disabled={!item.level} // chưa chọn mức thì chưa cho chọn mục
                  >
                    <option value="">-- Chọn mục --</option>
                    {getMucOptions(item.level).map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Loại tiêu chí */}
                <td className="bangdiem-td">
                  <select
                    value={item.type}
                    onChange={(e) =>
                      handleChange(index, "type", e.target.value)
                    }
                    className="bangdiem-select"
                    disabled={mucLevel !== "1" && !item.mucCha} // phải có mức cha nếu > 1
                  >
                    <option value="">--</option>
                    {types.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Nội dung */}
                <td className="bangdiem-td">
                  <input
                    type="text"
                    value={item.content}
                    onChange={(e) =>
                      handleChange(index, "content", e.target.value)
                    }
                    placeholder="Nhập nội dung..."
                    className="bangdiem-input"
                    disabled={mucLevel !== "1" && !item.mucCha}
                  />
                </td>

                {/* Điểm */}
                <td className="bangdiem-td">
                  <input
                    type="text"
                    value={item.score}
                    onChange={(e) =>
                      handleChange(index, "score", e.target.value)
                    }
                    placeholder="Nhập điểm..."
                    className="bangdiem-input"
                    disabled={mucLevel !== "1" && !item.mucCha}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <button onClick={handleThemBangDiem} className="luubangdiem-button">
        Lưu bảng điểm
      </button>
    </div>
  );
};

export default GroupedCriteriaTable;
