"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation"; 
import "../../styles/teachers/xemdslop.css";

type LopHoc = {
  ma_lop_sinh_hoat: string;
  ten_lop: string;
  ten_giang_vien: string; 
  trang_thai: string;
  phong_dao_tao?: string; 
};

export default function XemDanhSachLop() {
  const router = useRouter();
  const searchParams = useSearchParams(); 
  const [danhSachLop, setDanhSachLop] = useState<LopHoc[]>([]);
  const [userRole, setUserRole] = useState<string>(""); 

  useEffect(() => {
    const sessionRaw = localStorage.getItem("session") || "{}";
    const session = JSON.parse(sessionRaw);
    
    const maGiangVien = session?.ma_giang_vien || "";
    const maHocKy = session?.ma_hoc_ky || "";
    

    const maKhoa = searchParams.get("matruongkhoa");

    if (!maGiangVien || !maHocKy) {
      alert("Không tìm thấy thông tin Giảng viên hoặc Học kỳ để tải dữ liệu.");
      return;
    }

    let apiUrl = `http://localhost:8080/api/xemdanhsachbangdiemsinhvientheolop/${maGiangVien}/${maHocKy}`;

    // Nếu có mã khoa từ URL, thêm nó vào dưới dạng query parameter
    if (maKhoa) {
      apiUrl = `http://localhost:8080/api/xemdanhsachbangdiemsinhvientheolop/${maKhoa}/${maHocKy}`;
    }

    fetch(apiUrl)
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

  }, [searchParams]); 

  const handleViewDetails = (lop: LopHoc) => {
    const sessionRaw = localStorage.getItem("session") || "{}";
    const session = JSON.parse(sessionRaw);
    const maHocKy = session?.ma_hoc_ky || "";
    
    router.push(`/teacher/xemdssinhvien?malop=${lop.ma_lop_sinh_hoat}&mahocky=${maHocKy}`);
  };

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
            {/* Trưởng khoa và Chuyên viên đều thấy cột CVHT */}
            {(userRole === "truongkhoa" || userRole === "chuyenvien") && <th>Cố vấn học tập</th>}
            <th>Chi tiết</th>
            <th>Trạng thái</th>
            {/* Chỉ Chuyên viên mới thấy cột Phòng đào tạo */}
            {userRole === "chuyenvien" && <th>Phòng đào tạo</th>}
          </tr>
        </thead>
        <tbody>
          {danhSachLop.map((lop, index) => (
            <tr key={lop.ma_lop_sinh_hoat}>
              <td>{index + 1}</td>
              <td>{lop.ten_lop}</td>
              {/* Trưởng khoa và Chuyên viên đều thấy cột CVHT */}
              {(userRole === "truongkhoa" || userRole === "chuyenvien") && <td>{lop.ten_giang_vien}</td>}
              <td>
                <button
                  className="dslop-btn-xem"
                  onClick={() => handleViewDetails(lop)}
                >
                  Xem chi tiết
                </button>
              </td>
              <td>{lop.trang_thai}</td>
              {/* Chỉ Chuyên viên mới thấy cột Phòng đào tạo */}
              {userRole === "chuyenvien" && <td>{lop.phong_dao_tao || "Chưa xử lý"}</td>}
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