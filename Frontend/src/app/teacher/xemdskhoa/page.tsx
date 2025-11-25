"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
// Tái sử dụng CSS từ trang xem danh sách lớp
import "../../styles/teachers/xemdslop.css"; 

// Định nghĩa kiểu dữ liệu cho một khoa
type Khoa = {
  stt: number;
  ten_khoa: string;
  truong_khoa: string;
  trang_thai: string;
};

export default function XemDanhSachKhoa() {
  const router = useRouter();

  // Dữ liệu tĩnh dựa trên hình ảnh
  const [danhSachKhoa, setDanhSachKhoa] = useState<Khoa[]>([
    {
      stt: 1,
      ten_khoa: "Công nghệ thông tin",
      truong_khoa: "Nguyễn Hoàng Hà",
      trang_thai: "Đã chấm",
    },
    {
      stt: 2,
      ten_khoa: "Công nghệ sinh học",
      truong_khoa: "Trần Văn B",
      trang_thai: "Chưa chấm",
    },
  ]);

  // Hàm xử lý khi nhấn nút "Xem"
  const handleViewDetails = (tenKhoa: string) => {
    // Chuyển hướng đến trang chi tiết của khoa đó (ví dụ: danh sách lớp trong khoa)
    router.push(`/teacher/xemdslop?khoa=${tenKhoa}`);
    alert(`Chuyển đến chi tiết khoa ${tenKhoa}`);
  };

  // Hàm xử lý khi nhấn nút "Gửi"
  const handleSubmit = () => {
    alert("Xử lý logic gửi dữ liệu...");
  };

  return (
    // Sử dụng lại các class CSS từ xemdslop.css
    <div className="dslop-container">
      <h2>Đánh giá điểm rèn luyện - Danh sách Khoa</h2>
      <table className="dslop-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên khoa</th>
            <th>Trưởng khoa</th>
            <th>Chi tiết</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {danhSachKhoa.map((khoa) => (
            <tr key={khoa.stt}>
              <td>{khoa.stt}</td>
              <td>{khoa.ten_khoa}</td>
              <td>{khoa.truong_khoa}</td>
              <td>
                <button
                  className="dslop-btn-xem"
                  onClick={() => handleViewDetails(khoa.ten_khoa)}
                >
                  Xem
                </button>
              </td>
              <td>{khoa.trang_thai}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="dslop-buttons">
        <button onClick={handleSubmit} className="dslop-btn-gui">
          Gửi
        </button>
      </div>
    </div>
  );
}