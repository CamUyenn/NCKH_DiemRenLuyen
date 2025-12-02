"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../../styles/teachers/xemdslop.css";

// Cập nhật kiểu dữ liệu để khớp với API mới
type LopHoc = {
  ma_lop_sinh_hoat: string;
  ten_lop: string;
  ten_giang_vien: string; // Đổi từ cvht sang ten_giang_vien
  trang_thai: string;
};

export default function XemDanhSachLop() {
  const router = useRouter();
  const [danhSachLop, setDanhSachLop] = useState<LopHoc[]>([]);
  const [userRole, setUserRole] = useState<string>(""); // 'covan' hoặc 'truongkhoa'

  useEffect(() => {
    // Lấy thông tin người dùng từ localStorage
    const sessionRaw = localStorage.getItem("session") || "{}";
    const session = JSON.parse(sessionRaw);
    
    const maGiangVien = session?.ma_giang_vien || "";
    const maHocKy = session?.ma_hoc_ky || "";
    const role = session?.type || ""; // 'covan' hoặc 'truongkhoa'
    
    setUserRole(role);

    // Kiểm tra các thông tin cần thiết cho API
    if (!maGiangVien || !maHocKy || !role) {
      alert("Không tìm thấy thông tin Giảng viên, Học kỳ hoặc Vai trò để tải dữ liệu.");
      return;
    }

    // Fetch dữ liệu từ API với đầy đủ tham số
    fetch(`http://localhost:8080/api/xemdanhsachbangdiemsinhvientheolop/${maGiangVien}/${maHocKy}/${role}`)
      .then(res => {
        if (!res.ok) {
          throw new Error("Lỗi khi tải dữ liệu từ server");
        }
        return res.json();
      })
      .then(data => {
        if (data && data.danh_sach_theo_lop) {
          setDanhSachLop(data.danh_sach_theo_lop);
        } else {
          setDanhSachLop([]);
        }
      })
      .catch(err => {
        console.error("Lỗi khi fetch danh sách lớp:", err);
        alert("Không thể tải danh sách lớp. Vui lòng kiểm tra lại.");
      });

  }, []);

  // Hàm xử lý khi nhấn nút "Xem chi tiết"
  const handleViewDetails = (lop: LopHoc) => {
    // Lấy mã học kỳ từ session để truyền đi
    const sessionRaw = localStorage.getItem("session") || "{}";
    const session = JSON.parse(sessionRaw);
    const maHocKy = session?.ma_hoc_ky || "";
    
    // Chuyển đến trang chi tiết lớp với mã lớp và mã học kỳ
    router.push(`/teacher/xemdssinhvien?malop=${lop.ma_lop_sinh_hoat}&mahocky=${maHocKy}`);
  };

  // Hàm xử lý khi nhấn nút "Gửi"
  const handleSubmit = () => {
    alert("Chức năng gửi đang được phát triển...");
  };

  return (
    <div className="dslop-container">
      <h2>Đánh giá điểm rèn luyện</h2>
      <table className="dslop-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên lớp</th>
            {/* Chỉ hiển thị cột CVHT nếu là Trưởng khoa */}
            {userRole === "truongkhoa" && <th>Cố vấn học tập</th>}
            <th>Chi tiết</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {danhSachLop.map((lop, index) => (
            <tr key={lop.ma_lop_sinh_hoat}>
              <td>{index + 1}</td>
              <td>{lop.ten_lop}</td>
              {/* Chỉ hiển thị cột CVHT nếu là Trưởng khoa */}
              {userRole === "truongkhoa" && <td>{lop.ten_giang_vien}</td>}
              <td>
                <button
                  className="dslop-btn-xem"
                  onClick={() => handleViewDetails(lop)}
                >
                  Xem chi tiết
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