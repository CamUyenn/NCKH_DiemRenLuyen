"use client";

import "./../../styles/Admin/ChinhSuaBangDiem.css";
import React, { useState } from "react";
import { diemData, Diem } from "./../data";
import { useRouter, useSearchParams } from "next/navigation";

interface RowData {
  muc: string;
  mucCha?: string;
  mucLevel: number;
  loai: string;
  noiDung: string;
  diem?: string;
}

const mucLevels = [1, 2, 3, 4];
const loaiOptions = ["checkbox", "radio", "none"];

const ChinhSuaBangDiem: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const raw = searchParams.get("raw"); // ✅ lấy raw từ URL

  const [rows, setRows] = useState<RowData[]>([
    { muc: "", mucCha: "", mucLevel: 1, loai: "none", noiDung: "", diem: "" },
  ]);

  const handleLuuChinhSua = () => {
    if (raw) {
      // ✅ Lưu rows xuống localStorage
      localStorage.setItem(`bangdiem_${raw}`, JSON.stringify(rows));

      // Điều hướng
      router.push(`/admin/luuchinhsua?raw=${raw}`);
    } else {
      alert("Không tìm thấy thông tin raw!");
    }
  };

  // Xử lý thay đổi dữ liệu
  const handleChange = (index: number, field: keyof RowData, value: string) => {
    const updatedRows = [...rows];

    if (field === "mucLevel") {
      updatedRows[index][field] = Number(value) as any;
    } else {
      updatedRows[index][field] = value as any;
    }

    // Nếu thay đổi muc/mucCha/mucLevel -> tìm dữ liệu trong diemData
    if (["muc", "mucCha", "mucLevel"].includes(field)) {
      const found = diemData.find(
        (c: Diem) =>
          c.muc === (field === "muc" ? value : updatedRows[index].muc) &&
          (c.mucCha || "") ===
            (field === "mucCha" ? value : updatedRows[index].mucCha || "") &&
          c.mucLevel ===
            (field === "mucLevel" ? Number(value) : updatedRows[index].mucLevel)
      );

      if (found) {
        updatedRows[index].noiDung = found.noiDung;
        updatedRows[index].diem = found.diem || "";
        updatedRows[index].loai = found.loai;
      } else {
        updatedRows[index].noiDung = "";
        updatedRows[index].diem = "";
        updatedRows[index].loai = "none";
      }
    }

    setRows(updatedRows);

    // 👉 Tự động thêm hàng mới khi đang sửa hàng cuối cùng
    const isLastRow = index === rows.length - 1;
    const hasData =
      updatedRows[index].muc !== "" ||
      updatedRows[index].noiDung.trim() !== "" ||
      updatedRows[index].diem?.trim() !== "";

    if (isLastRow && hasData) {
      setRows([
        ...updatedRows,
        {
          muc: "",
          mucCha: "",
          mucLevel: 1,
          loai: "none",
          noiDung: "",
          diem: "",
        },
      ]);
    }
  };

  // 👉 Xóa hàng hoặc mục đã chọn
  const handleDeleteRow = (index: number) => {
    const row = rows[index];

    if (!row.muc) {
      // Nếu chưa chọn mục => chỉ xóa hàng
      if (rows.length === 1) return;
      setRows(rows.filter((_, i) => i !== index));
    } else {
      // Nếu đã chọn mục từ diemData => xóa mục đó
      const confirmDelete = window.confirm(
        `Bạn có chắc muốn xóa mục "${row.muc} - ${row.noiDung}" không?`
      );
      if (confirmDelete) {
        // Cách 1: Xóa hẳn khỏi bảng
        setRows(rows.filter((_, i) => i !== index));

        // 👉 Cách 2: Nếu muốn lưu thông tin xóa để backend xử lý
        // setRows(rows.map((r, i) => i === index ? {...r, deleted: true} : r));
      }
    }
  };

  return (
    <div className="bangdiem-container">
      <h2 className="bangdiem-title">Chỉnh sửa bảng điểm</h2>

      <table className="bangdiem-table">
        <thead>
          <tr>
            <th className="bangdiem-th">Mức</th>
            <th className="bangdiem-th">Mức cha</th>
            <th className="bangdiem-th">Mục</th>
            <th className="bangdiem-th">Loại tiêu chí</th>
            <th className="bangdiem-th">Nội dung tiêu chí</th>
            <th className="bangdiem-th">Điểm</th>
            <th className="bangdiem-th">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item, index) => (
            <tr key={index} className="bangdiem-tr">
              {/* Mức */}
              <td className="bangdiem-td">
                <select
                  value={item.mucLevel}
                  onChange={(e) =>
                    handleChange(index, "mucLevel", e.target.value)
                  }
                  className="bangdiem-select"
                >
                  {mucLevels.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
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
                  disabled={item.mucLevel === 1}
                >
                  <option value="">-- Chọn mục cha --</option>
                  {diemData
                    .filter((d) => d.mucLevel < item.mucLevel)
                    .map((d, i) => (
                      <option key={i} value={d.muc}>
                        {`${d.muc} - ${d.noiDung}`}
                      </option>
                    ))}
                </select>
              </td>

              {/* Mục */}
              <td className="bangdiem-td">
                <select
                  value={item.muc}
                  onChange={(e) => handleChange(index, "muc", e.target.value)}
                  className="bangdiem-select"
                >
                  <option value="">-- Chọn mục --</option>
                  {diemData
                    .filter(
                      (d) =>
                        d.mucLevel === item.mucLevel &&
                        (item.mucLevel === 1 || d.mucCha === item.mucCha)
                    )
                    .map((d, i) => (
                      <option key={i} value={d.muc}>
                        {`${d.muc} - ${d.noiDung}`}
                      </option>
                    ))}
                </select>
              </td>

              {/* Loại tiêu chí */}
              <td className="bangdiem-td">
                <select
                  value={item.loai}
                  onChange={(e) => handleChange(index, "loai", e.target.value)}
                  className="bangdiem-select"
                >
                  {loaiOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </td>

              {/* Nội dung */}
              <td className="bangdiem-td">
                <input
                  type="text"
                  value={item.noiDung}
                  onChange={(e) =>
                    handleChange(index, "noiDung", e.target.value)
                  }
                  placeholder="Nhập nội dung..."
                  className="bangdiem-input"
                />
              </td>

              {/* Điểm */}
              <td className="bangdiem-td">
                <input
                  type="text"
                  value={item.diem}
                  onChange={(e) => handleChange(index, "diem", e.target.value)}
                  placeholder="Nhập điểm..."
                  className="bangdiem-input"
                />
              </td>

              {/* Hành động */}
              <td className="bangdiem-td">
                <button
                  className="bangdiem-delete-button"
                  onClick={() => handleDeleteRow(index)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Khi click sẽ quay về xembangdiem với đúng raw */}
      <button onClick={handleLuuChinhSua} className="luubangdiem-button">
        Chỉnh sửa và Thêm mới
      </button>
    </div>
  );
};

export default ChinhSuaBangDiem;
