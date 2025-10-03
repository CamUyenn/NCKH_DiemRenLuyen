"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "./../../styles/Admin/BangDiem.css";

interface BangDiemChiTiet {
  ma_tieu_chi: string;
  ma_bang_diem_tham_chieu: string;
  ten_tieu_chi: string;
  muc_diem: number;
  muc: string;
  diem: number;
  mo_ta_diem: string;
  ma_tieu_chi_cha: string;
  loai_tieu_chi: string;
  so_lan: number;
}

export default function BangDiem() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const raw = searchParams.get("raw"); // lấy raw từ URL hiện tại

  const [diemData, setDiemData] = useState<BangDiemChiTiet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!raw) return;
    fetch("http://localhost:8080/api/xemtieuchi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ma_bang_diem: raw }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("API data:", data);
        setDiemData(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setDiemData([]);
        setLoading(false);
      });
  }, [raw]);

  function handleCreate() {
    if (raw) {
      router.push(`/admin/chinhsuabangdiem?raw=${raw}`);
    } else {
      alert("Không tìm thấy thông tin raw trong URL!");
    }
  }

  function handleCopy() {
    if (!raw) {
      alert("Không tìm thấy thông tin raw trong URL!");
      return;
    }
    // Lưu dữ liệu hiện tại vào localStorage
    localStorage.setItem(`bangdiem_${raw}`, JSON.stringify(diemData));
    alert("Đã sao chép thành công!");
    router.push(`/admin/dataobangdiem?raw=${raw}`);
  }

  return (
    <div className="bangDiem-container">
      <h2>Bảng điểm rèn luyện</h2>
      {loading ? (
        <div>Đang tải dữ liệu...</div>
      ) : (
        <table className="bangDiem-table">
          <thead>
            <tr>
              <th>Mục</th>
              <th>Nội dung đánh giá</th>
              <th>Mô tả</th>
              <th>Điểm</th>
            </tr>
          </thead>
          <tbody>
            {diemData.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", color: "#888" }}>
                  Không có dữ liệu bảng điểm
                </td>
              </tr>
            ) : (
              diemData.map((item, index) => (
                <tr key={item.ma_tieu_chi}>
                  <td>{item.muc}</td>
                  <td>{item.ten_tieu_chi}</td>
                  <td>{item.mo_ta_diem}</td>
                  <td>{item.diem}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      <div className="bangDiem-buttons">
        <button onClick={handleCopy} className="bangDiem-btn">
          Sao chép bảng điểm
        </button>
        <button onClick={handleCreate} className="bangDiem-btn">
          Chỉnh sửa bảng điểm
        </button>
      </div>
    </div>
  );
}
