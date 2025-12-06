"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../../styles/teachers/xemdslop.css"; 

type Khoa = {
  ma_khoa: string;
  ten_khoa: string;
  ma_hoc_ky: string;
  ten_truong_khoa: string;
  ma_truong_khoa: string; 
  trang_thai: string;
};

export default function XemDanhSachKhoa() {
  const router = useRouter();
  const [danhSachKhoa, setDanhSachKhoa] = useState<Khoa[]>([]);

  useEffect(() => {
    // Lấy thông tin từ localStorage để gọi API
    const sessionRaw = localStorage.getItem("session") || "{}";
    const session = JSON.parse(sessionRaw);
    
    const maChuyenVien = session?.ma_giang_vien || ""; 
    const maHocKy = session?.ma_hoc_ky || "";

    if (!maChuyenVien || !maHocKy) {
      alert("Không tìm thấy thông tin chuyên viên hoặc học kỳ. Vui lòng đăng nhập lại.");
      return;
    }

    // Gọi API để lấy danh sách khoa
    fetch(`http://localhost:8080/api/xemdanhsachbangdiemsinhvientheokhoa/${maChuyenVien}/${maHocKy}`)
      .then(async res => { 
        if (!res.ok) {
          const errorData = await res.json().catch(() => null); 
          const errorMessage = errorData?.error || `Lỗi HTTP: ${res.status}`;
          throw new Error(errorMessage);
        }
        return res.json();
      })
      .then(data => {
        if (data && Array.isArray(data.danh_sach_theo_khoa)) {
          setDanhSachKhoa(data.danh_sach_theo_khoa);
        } else {
          console.error("Dữ liệu trả về không đúng định dạng:", data);
          setDanhSachKhoa([]);
        }
      })
      .catch(err => {
        console.error("Lỗi khi fetch danh sách khoa:", err);
        alert(`Không thể tải danh sách khoa: ${err.message}`);
      });

  }, []); 

  const handleViewDetails = (maKhoa: string, maTruongKhoa: string) => {
    const sessionRaw = localStorage.getItem("session") || "{}";
    const session = JSON.parse(sessionRaw);
    const maHocKy = session?.ma_hoc_ky || "";

    if (!maHocKy) {
      alert("Không tìm thấy mã học kỳ, không thể xem chi tiết.");
      return;
    }

    router.push(`/teacher/xemdslop?makhoa=${maKhoa}&mahocky=${maHocKy}&matruongkhoa=${maTruongKhoa}`);
  };

  const handleSubmit = () => {
    alert("Xử lý logic gửi dữ liệu...");
  };

  return (
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
          {danhSachKhoa.map((khoa, index) => (
            <tr key={khoa.ma_khoa}>
              <td>{index + 1}</td>
              <td>{khoa.ten_khoa}</td>
              <td>{khoa.ten_truong_khoa}</td>
              <td>
                <button
                  className="dslop-btn-xem"
                  onClick={() => handleViewDetails(khoa.ma_khoa, khoa.ma_truong_khoa)}
                >
                  Xem chi tiết
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