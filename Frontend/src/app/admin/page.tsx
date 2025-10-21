"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./../styles/Admin/Admin.css";

interface BangDiem {
  ma_bang_diem: string;
  hoc_ky: number;
  nam_hoc: string;
  bang_diem: string;
}

export default function HocKyTable() {
  const router = useRouter();
  const [bangDiemList, setBangDiemList] = useState<BangDiem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/xembangdiem")
      .then((res) => res.json())
      .then((data) => {
        setBangDiemList(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setBangDiemList([]);
        setLoading(false);
      });
  }, []);

  function handleCreate() {
    router.push("/admin/taohocky");
  }

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
          {bangDiemList.map((item, index) => (
            <tr key={item.ma_bang_diem}>
              <td>{index + 1}</td>
              <td>{item.nam_hoc}</td>
              <td>{item.hoc_ky}</td>
              <td>
                <span
                  className="hocKy-link"
                  onClick={() =>
                    router.push(`/admin/xembangdiem?raw=${item.ma_bang_diem}`)
                  }
                  style={{ cursor: "pointer" }}
                >
                  Xem
                </span>
              </td>
            </tr>
          ))}
          {bangDiemList.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", color: "#888" }}>
                Không có dữ liệu bảng điểm
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <button className="hocKy-button" onClick={handleCreate}>
        Tạo mới bảng điểm
      </button>
    </div>
  );
}
