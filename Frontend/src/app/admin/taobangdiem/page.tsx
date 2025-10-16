"use client";

import "./../../styles/Admin/TaoBangDiem.css";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

interface RowData {
  tenTieuChi: string; // Tên tiêu chí
  mucDiem: string;    // Mức điểm (int)
  muc: string;        // Mục
  diem: string;       // Điểm (int)
  moTaDiem?: string;  // Mô tả điểm
  maTieuChiCha?: string; // Mã tiêu chí cha
  loaiTieuChi: string;   // Loại tiêu chí
  soLan?: string;        // Số lần tối đa (int)
}

// Các danh sách mục theo level
const mucLevel1 = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
const mucLevel2 = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const mucLevel3 = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t"];

const levels = ["1", "2", "3"];
const types = ["Checkbox", "Radio", "Textbox", "None"];

const DaTaoBangDiem: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Lấy mã học kỳ từ query params
  const hocKyRaw = searchParams.get("hocky") || "";

  // Tách năm học và học kỳ từ chuỗi, ví dụ: "2024-2025.1"
  let namHoc = "";
  let hocKy = "";
  if (hocKyRaw) {
    const parts = hocKyRaw.split(".");
    namHoc = parts[0] || "";
    hocKy = parts[1] === "1" ? "1" : parts[1] === "2" ? "2" : "";
  }

  const [rows, setRows] = useState<RowData[]>([
    {
      tenTieuChi: "",
      mucDiem: "",
      muc: "",
      diem: "",
      moTaDiem: "",
      maTieuChiCha: "",
      loaiTieuChi: "",
      soLan: "",
    },
  ]);

  const handleChange = (index: number, field: keyof RowData, value: string) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);

    // Khi dòng cuối đã nhập đủ thì thêm dòng mới
    if (
      index === rows.length - 1 &&
      updatedRows[index].mucDiem &&
      (updatedRows[index].mucDiem === "1" || updatedRows[index].maTieuChiCha) &&
      updatedRows[index].muc &&
      updatedRows[index].loaiTieuChi &&
      updatedRows[index].tenTieuChi &&
      updatedRows[index].diem
    ) {
      setRows([
        ...updatedRows,
        {
          tenTieuChi: "",
          mucDiem: "",
          muc: "",
          diem: "",
          moTaDiem: "",
          maTieuChiCha: "",
          loaiTieuChi: "",
          soLan: "",
        },
      ]);
    }
  };

  const raw = `${namHoc}__${hocKy}`; // Tạo raw từ năm học và học kỳ

  const handleThemBangDiem = async () => {
    const validRows = rows.filter(
      (row) =>
        row.mucDiem &&
        row.muc &&
        row.loaiTieuChi &&
        row.tenTieuChi &&
        row.diem
    );
    const tieuchi = validRows.map((row) => ({
      TenTieuChi: row.tenTieuChi,
      MucDiem: parseInt(row.mucDiem, 10),
      Muc: row.muc,
      Diem: parseInt(row.diem, 10),
      MoTaDiem: row.moTaDiem || "",
      MaTieuChiCha: row.maTieuChiCha || "",
      LoaiTieuChi: row.loaiTieuChi,
      SoLan: row.loaiTieuChi === "Textbox" ? parseInt(row.soLan || "0", 10) : 0,
    }));

    const mabangdiemcheck = `${namHoc}.${hocKy}_BD`;

    try {
      const res = await fetch("http://localhost:8080/api/taotieuchi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ma_bang_diem: mabangdiemcheck,
          tieuchi: tieuchi,
        }),
      });
      const data = await res.json();
      if (res.ok && data && data.message === "Create tieuchi successful") {
        alert("Lưu bảng điểm thành công!");
        router.push(`/admin/dataobangdiem?raw=${mabangdiemcheck}`);
      } else {
        alert(data.error || "Lưu bảng điểm thất bại!");
      }
    } catch (error) {
      alert("Có lỗi khi kết nối tới server!");
    }
  };

  const getMucOptions = (level: string) => {
    if (level === "1") return mucLevel1;
    if (level === "2") return mucLevel2;
    if (level === "3") return mucLevel3;
    return [];
  };

  const getMucChaOptions = (level: string) => {
    if (level === "2")
      return rows.filter((r) => r.mucDiem === "1").map((r) => r.muc);
    if (level === "3")
      return rows.filter((r) => r.mucDiem === "2").map((r) => r.muc);
    return [];
  };

  return (
    <div className="bangdiem-container">
      <h2 className="bangdiem-title">
        Bảng tiêu chí đánh giá
        {hocKyRaw && (
          <span style={{ display: "block", fontSize: 18, marginTop: 8, color: "#003366", fontWeight: 600 }}>
            Năm học: {namHoc} &nbsp;|&nbsp; Học kỳ: {hocKy}
          </span>
        )}
      </h2>

      <table className="bangdiem-table">
        <thead>
          <tr>
            <th className="bangdiem-th">Mức điểm</th>
            <th className="bangdiem-th">Mục cha</th>
            <th className="bangdiem-th">Mục</th>
            <th className="bangdiem-th">Loại tiêu chí</th>
            <th className="bangdiem-th">Tên tiêu chí</th>
            <th className="bangdiem-th">Mô tả điểm</th>
            <th className="bangdiem-th">Điểm</th>
            <th className="bangdiem-th">Số lần tối đa</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item, index) => {
            const mucLevel = item.mucDiem;

            return (
              <tr key={index} className="bangdiem-tr">
                {/* Mức điểm */}
                <td className="bangdiem-td">
                  <select
                    value={item.mucDiem}
                    onChange={(e) => handleChange(index, "mucDiem", e.target.value)}
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

                {/* Mục cha */}
                <td className="bangdiem-td">
                  <select
                    value={item.maTieuChiCha || ""}
                    onChange={(e) => handleChange(index, "maTieuChiCha", e.target.value)}
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
                    value={item.muc}
                    onChange={(e) => handleChange(index, "muc", e.target.value)}
                    className="bangdiem-select"
                    disabled={!item.mucDiem} // chưa chọn mức thì chưa cho chọn mục
                  >
                    <option value="">-- Chọn mục --</option>
                    {getMucOptions(item.mucDiem).map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Loại tiêu chí */}
                <td className="bangdiem-td">
                  <select
                    value={item.loaiTieuChi}
                    onChange={(e) => handleChange(index, "loaiTieuChi", e.target.value)}
                    className="bangdiem-select"
                    disabled={mucLevel !== "1" && !item.maTieuChiCha} // phải có mức cha nếu > 1
                  >
                    <option value="">--</option>
                    {types.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Tên tiêu chí */}
                <td className="bangdiem-td">
                  <input
                    type="text"
                    value={item.tenTieuChi}
                    onChange={(e) => handleChange(index, "tenTieuChi", e.target.value)}
                    placeholder="Nhập tên tiêu chí..."
                    className="bangdiem-input"
                    disabled={mucLevel !== "1" && !item.maTieuChiCha}
                  />
                </td>

                {/* Mô tả điểm */}
                <td className="bangdiem-td">
                  <input
                    type="text"
                    value={item.moTaDiem || ""}
                    onChange={(e) => handleChange(index, "moTaDiem", e.target.value)}
                    placeholder="Nhập mô tả điểm..."
                    className="bangdiem-input"
                    disabled={mucLevel !== "1" && !item.maTieuChiCha}
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
                    disabled={mucLevel !== "1" && !item.maTieuChiCha}
                  />
                </td>

                {/* Số lần tối đa */}
                <td className="bangdiem-td">
                  <input
                    type="number"
                    min={0}
                    value={item.soLan || ""}
                    onChange={(e) => handleChange(index, "soLan", e.target.value)}
                    placeholder="Số lần tối đa"
                    className="bangdiem-input"
                    disabled={item.loaiTieuChi !== "Textbox" || mucLevel !== "1" && !item.maTieuChiCha}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "16px" }}>
        <button
          onClick={handleThemBangDiem}
          className="luubangdiem-button"
          style={{ marginLeft: "auto" }}
        >
          Lưu bảng điểm
        </button>
      </div>
    </div>
  );
};

export default DaTaoBangDiem;
