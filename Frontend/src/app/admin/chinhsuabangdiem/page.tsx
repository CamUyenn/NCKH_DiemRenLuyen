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
  maTieuChiCha?: string; // UI format: mức2 -> "I", mức3 -> "2.I"
  maTieuChi?: string;
  loaiTieuChi: string;
  soLan?: string;
}

const mucLevel1 = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
const mucLevel2 = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const mucLevel3 = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t"];
const levels = ["1", "2", "3"];
const types = ["Checkbox", "Radio", "Textbox", "None"];

/**
 * Helpers to convert DB <-> UI formats
 */
const parseMaTieuChiChaToUI = (dbVal?: string) => {
  if (!dbVal) return "";
  // lấy phần sau dấu '+'
  const afterPlus = (dbVal.split("+")[1] || "").trim();
  if (!afterPlus) return "";
  // nếu có dấu ',' (ví dụ "2,I") -> UI muốn "2.I"
  if (afterPlus.includes(",")) {
    const parts = afterPlus.split(",").map((p) => p.trim());
    return parts.join("."); // "2.I"
  }
  // nếu không có dấu ',' -> trả phần đó (ví dụ "I")
  return afterPlus;
};

const formatUIToMaTieuChiChaForAPI = (mabangdiemcheck: string, uiVal?: string) => {
  if (!uiVal) return "";
  const formatted = uiVal.replace(/\./g, ",");
  return `${mabangdiemcheck}+${formatted}`;
};

/**
 * Build hierarchical ordering helpers (kept from previous version)
 */
const buildHierarchyWithIndex = (rows: RowData[]) => {
  const indexed = rows.map((r, i) => ({ row: r, originalIndex: i }));
  const used = new Set<number>();
  const result: Array<{ row: RowData; originalIndex: number }> = [];

  const addIf = (predicate: (r: RowData, i: number) => boolean) => {
    indexed.forEach(({ row, originalIndex }) => {
      if (!used.has(originalIndex) && predicate(row, originalIndex)) {
        result.push({ row, originalIndex });
        used.add(originalIndex);
      }
    });
  };

  mucLevel1.forEach((m1) => {
    addIf((r) => r.mucDiem === "1" && r.muc === m1);

    const level1RowsForM1 = result.filter((x) => x.row.mucDiem === "1" && x.row.muc === m1);
    level1RowsForM1.forEach((lvl1) => {
      const level2Candidates = indexed
        .filter(({ row, originalIndex }) => !used.has(originalIndex) && row.mucDiem === "2" && row.maTieuChiCha === lvl1.row.muc)
        .sort((a, b) => {
          const ia = mucLevel2.indexOf(a.row.muc);
          const ib = mucLevel2.indexOf(b.row.muc);
          return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
        });

      level2Candidates.forEach(({ row: lvl2Row, originalIndex: lvl2Idx }) => {
        result.push({ row: lvl2Row, originalIndex: lvl2Idx });
        used.add(lvl2Idx);

        const parentUI = `${lvl2Row.muc}.${lvl1.row.muc}`;
        const level3Candidates = indexed
          .filter(({ row, originalIndex }) => !used.has(originalIndex) && row.mucDiem === "3" && row.maTieuChiCha === parentUI)
          .sort((a, b) => {
            const ia = mucLevel3.indexOf(a.row.muc);
            const ib = mucLevel3.indexOf(b.row.muc);
            return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
          });

        level3Candidates.forEach(({ row: lvl3Row, originalIndex: lvl3Idx }) => {
          result.push({ row: lvl3Row, originalIndex: lvl3Idx });
          used.add(lvl3Idx);
        });
      });
    });
  });

  indexed.forEach(({ row, originalIndex }) => {
    if (!used.has(originalIndex)) {
      result.push({ row, originalIndex });
      used.add(originalIndex);
    }
  });

  return result;
};

const buildHierarchyForProcessing = (rows: RowData[]) => {
  const result: RowData[] = [];
  const used = new Set<number>();
  const indexed = rows.map((r, i) => ({ row: r, idx: i }));

  const addIf = (predicate: (r: RowData) => boolean) => {
    indexed.forEach(({ row, idx }) => {
      if (!used.has(idx) && predicate(row)) {
        result.push(row);
        used.add(idx);
      }
    });
  };

  mucLevel1.forEach((m1) => {
    addIf((r) => r.mucDiem === "1" && r.muc === m1);

    const lvl1Rows = result.filter((r) => r.mucDiem === "1" && r.muc === m1);
    lvl1Rows.forEach((lvl1) => {
      const level2s = indexed
        .filter(({ row, idx }) => !used.has(idx) && row.mucDiem === "2" && row.maTieuChiCha === lvl1.muc)
        .sort((a, b) => {
          const ia = mucLevel2.indexOf(a.row.muc);
          const ib = mucLevel2.indexOf(b.row.muc);
          return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
        });

      level2s.forEach(({ row: lvl2Row, idx: lvl2Idx }) => {
        result.push(lvl2Row);
        used.add(lvl2Idx);

        const parentUI = `${lvl2Row.muc}.${lvl1.muc}`;
        const level3s = indexed
          .filter(({ row, idx }) => !used.has(idx) && row.mucDiem === "3" && row.maTieuChiCha === parentUI)
          .sort((a, b) => {
            const ia = mucLevel3.indexOf(a.row.muc);
            const ib = mucLevel3.indexOf(b.row.muc);
            return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
          });

        level3s.forEach(({ row: lvl3Row, idx: lvl3Idx }) => {
          result.push(lvl3Row);
          used.add(lvl3Idx);
        });
      });
    });
  });

  indexed.forEach(({ row, idx }) => {
    if (!used.has(idx)) {
      result.push(row);
      used.add(idx);
    }
  });

  return result;
};

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
        // Sửa logic: Nếu data là mảng và có phần tử thì mới map
        if (Array.isArray(data) && data.length > 0) {
          setRows(
            data.map((item: any) => ({
              tenTieuChi: item.ten_tieu_chi || "",
              mucDiem: item.muc_diem?.toString() || "",
              muc: item.muc || "",
              diem: item.diem?.toString() || "",
              moTaDiem: item.mo_ta_diem || "",
              // parse DB ma_tieu_chi_cha into UI format ("I" or "2.I")
              maTieuChiCha: parseMaTieuChiChaToUI(item.ma_tieu_chi_cha),
              maTieuChi: item.ma_tieu_chi || "",
              loaiTieuChi: item.loai_tieu_chi || "",
              soLan: item.so_lan?.toString() || "",
            }))
          );
        } else {
          // Nếu không, bao gồm cả trường hợp mảng rỗng, thì tạo một hàng trống
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

    // nếu chuyển sang mức 1 thì xóa maTieuChiCha
    if (field === "mucDiem" && value === "1") {
      updatedRows[index].maTieuChiCha = "";
    }

    setRows(updatedRows);
  };

// Thay thế toàn bộ getMucOptions bằng hàm này
const getMucOptions = (level: string, currentIndex: number) => {
  // Danh sách gốc theo level
  let allOptions: string[] = [];
  if (level === "1") allOptions = mucLevel1;
  else if (level === "2") allOptions = mucLevel2;
  else if (level === "3") allOptions = mucLevel3;
  else return [];

  // Nếu currentIndex không hợp lệ, trả về toàn bộ options
  if (currentIndex === undefined || currentIndex === null || typeof currentIndex !== "number") {
    return allOptions;
  }

  // Lấy parent của dòng hiện tại (UI format)
  const parent = rows[currentIndex]?.maTieuChiCha || "";

  // Tùy theo level áp scope khác nhau
  let usedValues: string[] = [];

  if (level === "1") {
    // uniqueness toàn bảng cho mức 1
    usedValues = rows
      .filter((r, i) => i !== currentIndex && r.mucDiem === "1" && r.muc)
      .map((r) => r.muc);
  } else if (level === "2") {
    // uniqueness theo parent (maTieuChiCha = muc mức1, ví dụ "I")
    // nếu parent rỗng => treat as its own bucket (chỉ ẩn trong các dòng cũng có parent = "")
    usedValues = rows
      .filter((r, i) => i !== currentIndex && r.mucDiem === "2" && (r.maTieuChiCha || "") === parent && r.muc)
      .map((r) => r.muc);
  } else if (level === "3") {
    // uniqueness theo parent (maTieuChiCha = "mucLevel2.mucLevel1", ví dụ "2.I")
    usedValues = rows
      .filter((r, i) => i !== currentIndex && r.mucDiem === "3" && (r.maTieuChiCha || "") === parent && r.muc)
      .map((r) => r.muc);
  }

  const available = allOptions.filter((opt) => !usedValues.includes(opt));
  return available;
};


  const getMucChaOptions = (level: string) => {
    if (level === "2") {
      return rows
        .filter((r) => r.mucDiem === "1")
        .map((r) => ({ value: r.muc || "", label: r.muc || "" }));
    }
    if (level === "3") {
      return rows
        .filter((r) => r.mucDiem === "2")
        .map((r) => {
          let muc1Label = "";
          if (r.maTieuChiCha) {
            muc1Label = r.maTieuChiCha;
          } else if (r.maTieuChi) {
            const afterPlus = (r.maTieuChi.split("+")[1] || "").trim();
            if (afterPlus.includes(",")) {
              const parts = afterPlus.split(",").map((p) => p.trim());
              muc1Label = parts[1] || parts[0] || "";
            }
          }
          const label = muc1Label ? `${r.muc}.${muc1Label}` : `${r.muc}`;
          return { value: label, label };
        });
    }
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

    const validRows = rows.filter((row) => row.tenTieuChi && row.tenTieuChi.trim() !== "");
    if (validRows.length === 0) {
      alert("Chưa có dữ liệu để lưu.");
      return;
    }
    const mabangdiemcheck = raw;

    // Sắp xếp theo phân cấp để cha đứng trước con
    const sortedValidRows = buildHierarchyForProcessing(validRows);

    const maTieuChiArr: string[] = [];

    const tieuchi = sortedValidRows.map((row, idx) => {
      const muc = row.muc || "";
      let maTieuChi = "";
      let maTieuChiChaFull = "";

      // Nếu không có maTieuChiCha (mức 1)
      if (!row.maTieuChiCha || row.maTieuChiCha === "") {
        // NEW: không dùng mucDiemNum hay "()"
        maTieuChi = `${mabangdiemcheck}+${muc}`;
      } else {
        // Tìm cha đã sinh trước đó trong sortedValidRows
        let mucDiemCha = row.mucDiem === "2" ? "1" : row.mucDiem === "3" ? "2" : "";
        // tìm cha index trong sortedValidRows
        let chaIdx = sortedValidRows.findIndex((r, i) => {
          if (i >= idx) return false;
          if (r.mucDiem !== mucDiemCha) return false;
          if (row.mucDiem === "2") {
            // mức 2: compare r.muc === row.maTieuChiCha (UI "I")
            return r.muc === row.maTieuChiCha;
          } else {
            // mức 3: compare `${r.muc}.${r.maTieuChiCha}` === row.maTieuChiCha (UI "2.I")
            return `${r.muc}.${r.maTieuChiCha}` === row.maTieuChiCha;
          }
        });

        if (chaIdx !== -1) {
          const maCha = maTieuChiArr[chaIdx];
          // lấy phần sau dấu '+' của maCha làm parentInner
          const parentInner = (maCha.split("+")[1] || "").trim();
          // NEW: tạo maTieuChi bằng cách nối muc và parentInner bằng dấu ','
          maTieuChi = `${mabangdiemcheck}+${muc},${parentInner}`;
          maTieuChiChaFull = maCha; // lưu maCha đầy đủ nếu cần
        } else {
          // fallback: dùng UI maTieuChiCha (thay '.' -> ',')
          const formattedParent = (row.maTieuChiCha || "").replace(/\./g, ",");
          maTieuChi = `${mabangdiemcheck}+${muc},${formattedParent}`;
        }

        // ma_tieu_chi_cha phải là định dạng API: mabangdiem + formatted UI ('.' -> ',')
        maTieuChiChaFull = formatUIToMaTieuChiChaForAPI(mabangdiemcheck, row.maTieuChiCha);
      }

      maTieuChiArr.push(maTieuChi);

      return {
        ma_tieu_chi: maTieuChi,
        ma_bang_diem_tham_chieu: mabangdiemcheck,
        ten_tieu_chi: row.tenTieuChi,
        muc_diem: row.mucDiem ? parseInt(row.mucDiem, 10) : 0,
        muc: row.muc,
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

  // render in hierarchical order but keep original indices
  const sortedForRender = buildHierarchyWithIndex(rows);

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
            <th className="bangdiem-th">Mức phân loại</th>
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
          {sortedForRender.map(({ row: item, originalIndex }) => {
            const mucLevel = item.mucDiem;

            return (
              <tr key={originalIndex} className="bangdiem-tr">
                {/* Mức điểm */}
                <td className="bangdiem-td">
                  <select
                    value={item.mucDiem}
                    onChange={(e) => handleChange(originalIndex, "mucDiem", e.target.value)}
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
                    onChange={(e) => handleChange(originalIndex, "maTieuChiCha", e.target.value)}
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
                    onChange={(e) => handleChange(originalIndex, "muc", e.target.value)}
                    className="bangdiem-select"
                    disabled={!item.mucDiem}
                  >
                    <option value="">-- Chọn mục --</option>
                    {getMucOptions(item.mucDiem, originalIndex).map((s) => (
                      <option key={s} value={s}>{s}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Loại tiêu chí */}
                <td className="bangdiem-td">
                  <select
                    value={item.loaiTieuChi}
                    onChange={(e) => handleChange(originalIndex, "loaiTieuChi", e.target.value)}
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
                    onChange={(e) => handleChange(originalIndex, "tenTieuChi", e.target.value)}
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
                    onChange={(e) => handleChange(originalIndex, "moTaDiem", e.target.value)}
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
                    onChange={(e) => handleChange(originalIndex, "diem", e.target.value)}
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
                    onChange={(e) => handleChange(originalIndex, "soLan", e.target.value)}
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
                      onClick={() => handleDeleteRow(originalIndex)}
                    >
                      Xóa
                    </button>
                    <button
                      className="bangdiem-add-button"
                      onClick={() => handleAddRow(originalIndex)}
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
