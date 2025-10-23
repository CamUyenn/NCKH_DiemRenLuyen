"use client";

import "./../../styles/Admin/ChinhSuaBangDiem.css";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface RowData {
  tenTieuChi: string;
  mucDiem: string;
  muc: string;
  diem: string;
  moTaDiem?: string;
  maTieuChiCha?: string;
  maTieuChi?: string;
  loaiTieuChi: string;
  soLan?: string;
}

const mucLevel1 = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
const mucLevel2 = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const mucLevel3 = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t"];
const levels = ["1", "2", "3"];
const types = ["Checkbox", "Radio", "Textbox", "None"];

const ChinhSuaBangDiem: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const raw = searchParams.get("raw");

  // Tách năm học và học kỳ từ raw
  let namHoc = "";
  let hocKy = "";
  if (raw) {
    const match = raw.match(/^([0-9\-]+)\.(\d)_BD/);
    if (match) {
      namHoc = match[1];
      hocKy = match[2];
    }
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!raw) return;
    setLoading(true);
    fetch(`http://localhost:8080/api/xemtieuchi/${raw}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("DATA:", data);
        if (Array.isArray(data)) {
          setRows(
            data.map((item: any) => ({
              tenTieuChi: item.ten_tieu_chi || "",
              mucDiem: item.muc_diem?.toString() || "",
              muc: item.muc || "",
              diem: item.diem?.toString() || "",
              moTaDiem: item.mo_ta_diem || "",
              maTieuChiCha: item.ma_tieu_chi_cha || "",
              maTieuChi: item.ma_tieu_chi || "", // thêm dòng này
              loaiTieuChi: item.loai_tieu_chi || "",
              soLan: item.so_lan?.toString() || "",
            }))
          );
        } else {
          setRows([
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
        setLoading(false);
      })
      .catch(() => {
        setRows([
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
        setLoading(false);
      });
  }, [raw]);
  

  const handleChange = (index: number, field: keyof RowData, value: string) => {
    const updatedRows = [...rows];
    updatedRows[index] = { ...updatedRows[index], [field]: value };
    setRows(updatedRows);

    // Nếu đang nhập ở cột "tenTieuChi" của dòng cuối và người dùng đã nhập nội dung -> thêm dòng mới
    if (index === updatedRows.length - 1 && field === "tenTieuChi" && value.trim() !== "") {
      setRows((prev) => [
        ...prev,
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

  const getMucOptions = (level: string) => {
    if (level === "1") return mucLevel1;
    if (level === "2") return mucLevel2;
    if (level === "3") return mucLevel3;
    return [];
  };

  const getMucChaOptions = (level: string) => {
  // Nếu là mức 2
  if (level === "2") {
    return rows
      .filter((r) => r.mucDiem === "1")
      .map((r) => {
        // Ví dụ: maTieuChi = "2024-2025.2_BD+1,I()"
        // → ta chỉ cần lấy "I" sau dấu phẩy và trước dấu ngoặc
        const match = r.maTieuChi?.match(/\+[^,]+,([^()]+)\(/);
        const label = match ? match[1] : "";
        return {
          value: r.maTieuChi || "",
          label: label || "",
        };
      });
  }

  // Nếu là mức 3
  if (level === "3") {
    return rows
      .filter((r) => r.mucDiem === "2")
      .map((r) => {
        // maTieuChi dạng: "2024-2025.2_BD+2,1(+1,I)"
        // cần lấy "1" từ phần +2,1 và "I" từ phần (+1,I)
        const outerMatch = r.maTieuChi?.match(/\+[^,]+,([^()]+)\(/); // lấy 1
        const innerMatch = r.maTieuChi?.match(/\(\+[^,]+,([^()]+)\)/); // lấy I
        const outer = outerMatch ? outerMatch[1] : "";
        const inner = innerMatch ? innerMatch[1] : "";
        const label = inner ? `${outer}.${inner}` : outer;

        return {
          value: r.maTieuChi || "",
          label: label || "",
        };
      });
  }

  // Mức 1 không có cha
  return [];
};


  const handleDeleteRow = (index: number) => {
    if (rows.length === 1) return;
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleAddRow = (index: number) => {
    const newRows = [...rows];
    newRows.splice(index + 1, 0, {
      tenTieuChi: "",
      mucDiem: "",
      muc: "",
      diem: "",
      moTaDiem: "",
      maTieuChiCha: "",
      loaiTieuChi: "",
      soLan: "",
    });
    setRows(newRows);
  };

  const handleLuuChinhSua = async () => {
    if (!raw) {
      alert("Không tìm thấy thông tin raw!");
      return;
    }
    // Lấy tất cả dòng có tên tiêu chí (kể cả mức 1)
    const validRows = rows.filter(
      (row) => row.tenTieuChi && row.tenTieuChi.trim() !== ""
    );
    if (validRows.length === 0) {
      alert("Chưa có dữ liệu để lưu.");
      return;
    }
    const mabangdiemcheck = raw;

    // Mảng lưu các mã tiêu chí đã sinh, cùng thứ tự với validRows
    const maTieuChiArr: string[] = [];

    const tieuchi = validRows.map((row, idx) => {
      const mucDiemNum = parseInt(row.mucDiem || "0", 10);
      const muc = row.muc || "";

      let maTieuChi = "";
      let maTieuChiChaFull = "";

      if (!row.maTieuChiCha || row.maTieuChiCha === "") {
        // Mức 1
        maTieuChi = `${mabangdiemcheck}+${mucDiemNum},${muc}()`;
      } else {
        // Tìm dòng cha trong validRows
        let mucDiemCha = mucDiemNum === 2 ? 1 : mucDiemNum === 3 ? 2 : 0;
        let chaIdx = validRows.findIndex(
          (r, i) =>
            i < idx &&
            parseInt(r.mucDiem || "0", 10) === mucDiemCha &&
            (mucDiemNum === 2
              ? r.muc === row.maTieuChiCha
              : `${r.muc}.${r.maTieuChiCha}` === row.maTieuChiCha)
        );
        if (chaIdx !== -1) {
          const maCha = maTieuChiArr[chaIdx];
          // Lấy phần sau dấu '+'
          const plusSplit = maCha.split("+");
          const parentInner = plusSplit.length > 1 ? plusSplit[1] : maCha;
          maTieuChiChaFull = maCha;
          maTieuChi = `${mabangdiemcheck}+${mucDiemNum},${muc}(${parentInner})`;
        } else {
          // fallback nếu không tìm thấy cha
          maTieuChi = `${mabangdiemcheck}+${mucDiemNum},${muc}(${mucDiemCha},${row.maTieuChiCha}())`;
        }
      }

      maTieuChiArr.push(maTieuChi);

      return {
        ma_tieu_chi: maTieuChi,
        ma_bang_diem_tham_chieu: mabangdiemcheck,
        ten_tieu_chi: row.tenTieuChi,
        muc_diem: mucDiemNum,
        muc: muc,
        diem: row.diem ? parseInt(row.diem, 10) : 0,
        mo_ta_diem: row.moTaDiem || "",
        ma_tieu_chi_cha: maTieuChiChaFull || "",
        loai_tieu_chi: row.loaiTieuChi || "",
        so_lan: row.loaiTieuChi === "Textbox" ? (row.soLan ? parseInt(row.soLan, 10) : 0) : 0,
      };
    });

    try {
      const res = await fetch("http://localhost:8080/api/suatieuchi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ma_bang_diem_chinh_sua: mabangdiemcheck,
          tieuchi: tieuchi,
        }),
      });
      const data = await res.json();
      if (res.ok && data && data.message === "Update tieuchi successful") {
        alert("Cập nhật bảng điểm thành công!");
        router.push(`/admin/xembangdiem?raw=${mabangdiemcheck}`);
      } else {
        alert(data.error || "Cập nhật bảng điểm thất bại!");
      }
    } catch (error) {
      alert("Có lỗi khi kết nối tới server!");
    }
  };

  function extractMucCha(maTieuChiCha: string) {
    // Tìm phần trong ngoặc cuối cùng
    const match = maTieuChiCha.match(/\(([^()]*)\)$/);
    if (match && match[1]) {
      // Nếu là dạng "1,III", trả về "1.III"
      const parts = match[1].split(",");
      if (parts.length === 2) {
        return `${parts[0].trim()}.${parts[1].trim()}`;
      }
      return match[1].trim();
    }
    return "";
  }

  function extractMucSymbol(maTieuChiCha: string) {
    // Tìm ký hiệu mục sau dấu ',' và trước dấu '(' hoặc ')'
    const match = maTieuChiCha.match(/,([IVXLCDM]+)[()\)]?/);
    return match ? match[1] : maTieuChiCha;
  }

  function getMucChaLabelForMuc3(maTieuChiCha: string, rows: RowData[]) {
    // Tìm dòng mức 2 có mã tiêu chí là maTieuChiCha
    const muc2 = rows.find(r => r.maTieuChi === maTieuChiCha && r.mucDiem === "2");
    if (muc2) {
      return `${muc2.muc}.${muc2.maTieuChiCha}`;
    }
    return "";
  }

  return (
    <div className="bangdiem-container">
      <h2 className="bangdiem-title">
        Chỉnh sửa bảng tiêu chí đánh giá
        {raw && (
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
            <th className="bangdiem-th">Hành động</th>
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
                    disabled={mucLevel === "1"}
                  >
                    <option value="">-- Chọn mức cha --</option>
                    {getMucChaOptions(mucLevel).map((mc, i) => (
                      <option key={i} value={mc.value}>
                        {mc.label}
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
                    disabled={!item.mucDiem}
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
                    disabled={mucLevel !== "1" && !item.maTieuChiCha}
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
                    disabled={item.loaiTieuChi !== "Textbox" || (mucLevel !== "1" && !item.maTieuChiCha)}
                  />
                </td>
                {/* Hành động */}
                <td className="bangdiem-td">
                  <div className="bangdiem-action-buttons">
                    <button
                      className="bangdiem-delete-button"
                      onClick={() => handleDeleteRow(index)}
                    >
                      Xóa
                    </button>
                    <button
                      className="bangdiem-add-button"
                      onClick={() => handleAddRow(index)}
                    >
                      Thêm
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "16px" }}>
        <button
          onClick={handleLuuChinhSua}
          className="luubangdiem-button"
          style={{ marginLeft: "auto" }}
        >
          Chỉnh sửa và Thêm mới
        </button>
      </div>
    </div>
  );
};

export default ChinhSuaBangDiem;
