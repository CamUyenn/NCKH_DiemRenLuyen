"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "../../styles/teachers/xemdslop.css";

type LopHoc = {
  ma_lop_sinh_hoat: string;
  ten_lop: string;
  ten_giang_vien: string;
  trang_thai: string; 
};

// Hàm ánh xạ trạng thái từ API sang chuỗi hiển thị trên giao diện
const getDisplayStatus = (rawStatus: string, role: string): string => {
  if (role === 'giangvien') {
    if (rawStatus === 'Giảng Viên Đã Chấm') return 'Giảng Viên Đã Chấm';
    if (rawStatus === 'Lớp Trưởng Đã Chấm') return 'Lớp Trưởng Đã Chấm';
    return 'Lớp Trưởng Chưa Chấm';
  }

  if (role === 'truongkhoa') {
    if (rawStatus === 'Đã Chấm Xong') {
      return 'Trưởng Khoa Đã Chấm';
    }
    if (rawStatus === 'Đã Chấm') {
      return 'Giảng Viên Đã Chấm';
    }
    return 'Giảng Viên Chưa Chấm';
  }
  if (role === 'chuyenviendaotao') {
    if (rawStatus === 'Chuyên Viên Đã Chấm') return 'Chuyên Viên Đã Chấm';
    if (rawStatus === 'Đã Chấm Xong') return 'Trưởng Khoa Đã Chấm';
    return 'Trưởng Khoa Chưa Chấm';
  }
  return rawStatus;
};

export default function XemDanhSachLop() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [danhSachLop, setDanhSachLop] = useState<LopHoc[]>([]);
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    const sessionRaw = localStorage.getItem("session") || "{}";
    const session = JSON.parse(sessionRaw);
    const role = session?.type || "";
    const maHocKy = session?.ma_hoc_ky || "";
    setUserRole(role);

    if (!maHocKy) return;

    let identifier = "";
    if (role === 'giangvien') {
      identifier = session?.ma_giang_vien || "";
    } else if (role === 'truongkhoa') {
      identifier = session?.ma_khoa || session?.ma_giang_vien || ""; 
    } else if (role === 'chuyenviendaotao') {
      identifier = searchParams.get("matruongkhoa") || "";
    }

    if (!identifier) return;

    const apiUrl = `http://localhost:8080/api/xemdanhsachbangdiemsinhvientheolop/${identifier}/${maHocKy}`;

    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        const fetchedLops: LopHoc[] = data?.danh_sach_theo_lop || [];
        setDanhSachLop(fetchedLops);
      })
      .catch(err => console.error("Lỗi tải danh sách lớp:", err));
  }, [searchParams]);

  const handleViewDetails = (lop: LopHoc) => {
    const sessionRaw = localStorage.getItem("session") || "{}";
    const session = JSON.parse(sessionRaw);
    const maHocKy = session?.ma_hoc_ky || "";
    router.push(`/teacher/xemdssinhvien?malop=${lop.ma_lop_sinh_hoat}&mahocky=${maHocKy}`);
  };

  const handleSubmit = async () => {
    const sessionRaw = localStorage.getItem("session") || "{}";
    const session = JSON.parse(sessionRaw);
    const maHocKy = session?.ma_hoc_ky || "";
    const role = session?.type || "";

    if (danhSachLop.length === 0) {
      alert("Không có lớp nào trong danh sách để gửi.");
      return;
    }

    const maLopSinhHoat = danhSachLop.map(lop => lop.ma_lop_sinh_hoat);
    let apiEndpoint = "";
    let payload: any = {};

    if (role === 'giangvien' || role === 'truongkhoa') {
        apiEndpoint = "http://localhost:8080/api/thaydoitrangthaigiangvien";
        payload = {
            malopsinhhoat: maLopSinhHoat,
            mahocky: maHocKy,
            type: role,
        };
    } else if (role === 'chuyenviendaotao') {
        apiEndpoint = "http://localhost:8080/api/thaydoitrangthaichuyenvien";
        const maKhoa = searchParams.get("makhoa") || "";
        payload = {
            makhoa: [maKhoa],
            mahocky: maHocKy,
            type: "chuyenviendaotao",
        };
    } else {
        alert("Vai trò không hợp lệ để thực hiện hành động này.");
        return;
    }

    try {
        const response = await fetch(apiEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Server trả về lỗi khi cố gắng gửi.");

        alert("Gửi thành công!");
        window.location.reload(); 
    } catch (error) {
        console.error("Lỗi khi gửi:", error);
        alert("Gửi thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="dslop-container">
      <h2 className="dslop-header">Đánh giá điểm rèn luyện</h2>
      <table className="dslop-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên lớp</th>
            <th>Cố vấn học tập</th>
            <th>Chi tiết</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {danhSachLop.map((lop, index) => (
            <tr key={lop.ma_lop_sinh_hoat}>
              <td>{index + 1}</td>
              <td>{lop.ten_lop}</td>
              <td>{lop.ten_giang_vien}</td>
              <td>
                <button onClick={() => handleViewDetails(lop)} className="dslop-btn-xem">
                  Xem chi tiết
                </button>
              </td>
              <td>{getDisplayStatus(lop.trang_thai, userRole)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {userRole !== 'chuyenviendaotao' && (
        <div className="dslop-buttons">
            <button onClick={handleSubmit} className="dslop-btn-gui">
                Gửi
            </button>
        </div>
      )}
    </div>
  );
}