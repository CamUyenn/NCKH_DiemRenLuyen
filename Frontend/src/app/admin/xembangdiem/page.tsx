"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { diemData, Diem } from "./../data"; 
import "./../../styles/Admin/BangDiem.css";

export default function BangDiem() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const raw = searchParams.get("raw"); // lấy raw từ URL hiện tại
  const bigSections = ["I", "II", "III", "IV", "V", "VI"];

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
    // Nếu muốn điều hướng sau khi sao chép thì giữ lại:
    router.push(`/admin/taobangdiemxong?raw=${raw}`);
  }

  return (
    <div className="bangDiem-container">
      <h2>Bảng điểm rèn luyện</h2>
      <table className="bangDiem-table">
        <thead>
          <tr>
            <th>Mục</th>
            <th>Nội dung đánh giá</th>
            <th>Mô tả</th>
          </tr>
        </thead>
        <tbody>
          {diemData.map((item, index) => {
            const isBig = bigSections.includes(item.muc);
            return (
              <tr key={index} className={isBig ? "big-section" : ""}>
                <td style={{ fontWeight: isBig ? "bold" : "normal" }}>
                  {item.muc}
                </td>
                <td style={{ fontWeight: isBig ? "bold" : "normal" }}>
                  {item.noiDung}
                </td>
                <td>{item.diem || ""}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="bangDiem-buttons">
        {/* Gắn handleCopy vào nút */}
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
