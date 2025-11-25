"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
// Bỏ import AppHeader vì đã có ở layout
// import AppHeader from "../../components/Header"; 
import "../../styles/teachers/xemdslop.css"; 

// Định nghĩa kiểu dữ liệu cho một lớp học
type LopHoc = {
  stt: number;
  ten_lop: string;
  cvht: string;
  trang_thai: string;
};

export default function XemDanhSachLop() {
  const router = useRouter();

  // Dữ liệu tĩnh dựa trên hình ảnh
  const [danhSachLop, setDanhSachLop] = useState<LopHoc[]>([
    {
      stt: 1,
      ten_lop: "K46A",
      cvht: "Lê Quang Chiến",
      trang_thai: "Đã chấm",
    },
    {
      stt: 2,
      ten_lop: "K46B",
      cvht: "Đoàn Thị Hồng Phước",
      trang_thai: "Chưa chấm",
    },
    {
      stt: 3,
      ten_lop: "K46C",
      cvht: "Nguyễn Văn A",
      trang_thai: "Chưa chấm",
    },
    {
      stt: 4,
      ten_lop: "K47A",
      cvht: "Trần Thị B",
      trang_thai: "Đã chấm",
    },
  ]);

  // Hàm xử lý khi nhấn nút "Xem"
  const handleViewDetails = (tenLop: string) => {
    router.push(`/teacher/xemdssinhvien`);
    alert(`Chuyển đến chi tiết lớp ${tenLop}`);
  };

  // Hàm xử lý khi nhấn nút "Gửi"
  const handleSubmit = () => {
    alert("Xử lý logic gửi dữ liệu...");
  };

  return (
    // Chỉ render phần nội dung chính
    <div className="dslop-container">
      <h2>Đánh giá điểm rèn luyện</h2>
      <table className="dslop-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên lớp</th>
            <th>CVHT</th>
            <th>Chi tiết</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {danhSachLop.map((lop) => (
            <tr key={lop.stt}>
              <td>{lop.stt}</td>
              <td>{lop.ten_lop}</td>
              <td>{lop.cvht}</td>
              <td>
                <button
                  className="dslop-btn-xem"
                  onClick={() => handleViewDetails(lop.ten_lop)}
                >
                  Xem
                </button>
              </td>
              <td>{lop.trang_thai}</td>
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