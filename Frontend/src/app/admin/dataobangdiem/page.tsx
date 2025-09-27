"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import "./../../styles/Admin/TaoBangDiem.css";

interface RowData {
  muc: string;
  mucLevel: number;
  mucCha?: string;
  loai: string;
  noiDung: string;
  diem?: string;
}

export default function ThemMoiBangDiem() {
  const searchParams = useSearchParams();
  const raw = searchParams.get("raw");
  const [rows, setRows] = useState<RowData[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (raw) {
      const saved = localStorage.getItem(`bangdiem_${raw}`);
      if (saved) {
        setRows(JSON.parse(saved)); // vì đã đúng format rồi
      }
    }
  }, [raw]);

  function handleClose() {
    router.push(`/admin`);
  }
  return (
    <div className="bangdiem-container">
      <h2 className="bangdiem-title">Bảng điểm đã lưu</h2>

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
          {rows.map((item, index) => (
            <tr key={index} className="bangdiem-tr">
              <td className="bangdiem-td">{item.mucLevel}</td>
              <td className="bangdiem-td">{item.mucCha || "-"}</td>
              <td className="bangdiem-td">{item.muc}</td>
              <td className="bangdiem-td">{item.loai}</td>
              <td className="bangdiem-td">{item.noiDung}</td>
              <td className="bangdiem-td">{item.diem || ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleClose} className="button-closebangdiem">
        Đóng
      </button>
    </div>
  );
}
