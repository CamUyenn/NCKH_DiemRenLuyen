"use client";

import React from "react";
import { useRouter } from "next/navigation";
import "./../styles/Admin/Admin.css";

interface HocKy {
  id: number;
  raw: string;
}

export default function HocKyTable() {
  const router = useRouter();

  const hocKyData: HocKy[] = [
    { id: 1, raw: "2020-2022.1_BD0" },
    { id: 2, raw: "2020-2021.2_BD1" },
    { id: 3, raw: "2021-2022.1_BD0" },
    { id: 4, raw: "2021-2022.2_BD0" },
    { id: 5, raw: "2022-2023.1_BD1" },
    { id: 6, raw: "2022-2023.2_BD0" },
    { id: 7, raw: "2023-2024.1_BD0" },
    { id: 8, raw: "2023-2024.2_BD1" },
    { id: 9, raw: "2024-2025.1_BD0" },
  ];

  function handleCreate() {
    router.push("admin/taobangdiem");
  }

  // Luôn tạo 10 hàng
  const rows = Array.from({ length: 10 }, (_, i) => hocKyData[i]);

  return (
    <div className="hocKy-container">
      <h2>Danh sách bảng điểm rèn luyện</h2>
      <table className="hocKy-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Năm học</th>
            <th>Học kì</th>
            <th>Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item, index) => {
            if (item) {
              const parts = item.raw.split(".");
              const namhoc = parts[0];
              const hockyNumber = parts[1].split("_")[0];

              return (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{namhoc}</td>
                  <td>{hockyNumber}</td>
                  <td>
                    <span
                      className="hocKy-link"
                      onClick={() =>
                        router.push(`/admin/xembangdiem?raw=${item.raw}`)
                      }
                      style={{ cursor: "pointer" }}
                    >
                      Xem
                    </span>
                  </td>
                </tr>
              );
            } else {
              return (
                <tr key={`empty-${index}`} className="hocKy-empty-row">
                  <td>{index + 1}</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                </tr>
              );
            }
          })}
        </tbody>
      </table>

      <button className="hocKy-button" onClick={handleCreate}>
        Tạo mới bảng điểm
      </button>
    </div>
  );
}
