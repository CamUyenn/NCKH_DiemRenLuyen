"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "../../styles/teachers/xemdssinhvien.css";

// Định nghĩa kiểu dữ liệu cho sinh viên từ API
type SinhVien = {
  ma_sinh_vien: string;
  ho_dem: string;
  ten: string;
  ten_lop_sinh_hoat: string; // Thêm trường lớp
  trang_thai: string;        // Thêm trường trạng thái
  tong_diem_sinh_vien: number;
  tong_diem_lop_truong: number;
  tong_diem_co_van: number;
  tong_diem_truong_khoa: number;
  ma_sinh_vien_diem_ren_luyen: string;
};

export default function XemChiTietLop() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [danhSachSV, setDanhSachSV] = useState<SinhVien[]>([]);
  const [userRole, setUserRole] = useState<string>(""); 
  const [editedScores, setEditedScores] = useState<Record<string, number>>({});
  const [maLop, setMaLop] = useState("");
  const [maHocKy, setMaHocKy] = useState("");

  useEffect(() => {
    // 1. Lấy thông tin từ URL và localStorage
    const malop = searchParams.get("malop") || "";
    const mahocky = searchParams.get("mahocky") || "";
    const sessionRaw = localStorage.getItem("session") || "{}";
    const session = JSON.parse(sessionRaw);
    const role = session?.type || "";

    setMaLop(malop);
    setMaHocKy(mahocky);
    setUserRole(role);

    if (!malop || !mahocky) {
      alert("Không tìm thấy thông tin lớp hoặc học kỳ.");
      return;
    }

    // 2. Fetch dữ liệu danh sách sinh viên từ API
    fetch(`http://localhost:8080/api/xemdanhsachbangdiemsinhvien/${malop}/${mahocky}`)
      .then(res => {
        if (!res.ok) throw new Error("Lỗi khi tải danh sách sinh viên.");
        return res.json();
      })
      .then(data => {
        const studentData = data?.danh_sach_bang_diem_sinh_vien || [];
        setDanhSachSV(studentData);

        // Khởi tạo điểm chỉnh sửa ban đầu từ dữ liệu đã có trong DB
        const initialScores: Record<string, number> = {};
        studentData.forEach((sv: SinhVien) => {
          let score = 0;
          if (role === 'giangvien') { // Cố vấn
            score = sv.tong_diem_co_van;
          } else if (role === 'truongkhoa') {
            score = sv.tong_diem_truong_khoa;
          }
          initialScores[sv.ma_sinh_vien] = score;
        });
        setEditedScores(initialScores);
      })
      .catch(err => {
        console.error("Lỗi khi tải danh sách sinh viên:", err);
        alert("Không thể tải danh sách sinh viên.");
      });
  }, [searchParams]);

  // Hàm xử lý thay đổi điểm (dù đã ẩn textbox nhưng vẫn giữ hàm này để logic không bị gãy nếu cần dùng lại)
  const handleScoreChange = (maSV: string, diem: string) => {
    const newScore = parseInt(diem, 10);
    setEditedScores(prev => ({
      ...prev,
      [maSV]: isNaN(newScore) ? 0 : newScore,
    }));
  };

  // Hàm sao chép điểm cho một hàng
  const handleCopyRow = (sv: SinhVien) => {
    let scoreToCopy = 0;
    if (userRole === 'giangvien') {
      scoreToCopy = sv.tong_diem_lop_truong;
    } else if (userRole === 'truongkhoa') {
      scoreToCopy = sv.tong_diem_co_van;
    }
    setEditedScores(prev => ({ ...prev, [sv.ma_sinh_vien]: scoreToCopy }));
  };

  // Hàm sao chép điểm cho toàn bộ lớp
  const handleCopyAll = () => {
    const newScores: Record<string, number> = {};
    danhSachSV.forEach(sv => {
      let scoreToCopy = 0;
      if (userRole === 'giangvien') {
        scoreToCopy = sv.tong_diem_lop_truong;
      } else if (userRole === 'truongkhoa') {
        scoreToCopy = sv.tong_diem_co_van;
      }
      newScores[sv.ma_sinh_vien] = scoreToCopy;
    });
    setEditedScores(newScores);
  };

  // Hàm lưu điểm
  const handleSave = async () => {
    alert("Chức năng lưu điểm đang được phát triển (Cần API cập nhật tổng điểm).");
  };

  const handleViewDetails = (sv: SinhVien) => {
    router.push(`/teacher/xemchitiet?masv=${sv.ma_sinh_vien}&mahocky=${maHocKy}`);
  };

  return (
    <div className="xds-container">
      <h2>Danh sách sinh viên trong lớp</h2>
      <table className="xds-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã sinh viên</th>
            <th>Họ và tên</th>
            <th>Sinh viên</th>
            <th>Ban cán sự</th>

            {/* Logic hiển thị tiêu đề cột theo Role */}
            {userRole === 'giangvien' && (
              <>
                <th>Cố vấn</th>
                <th>Sao chép</th>
              </>
            )}
            
            {userRole === 'truongkhoa' && (
              <>
                <th>Cố vấn</th>
                <th>Sao chép</th>
                <th>Trưởng khoa</th>
              </>
            )}

            <th>Chi tiết</th>
            <th>Trạng thái</th> 
          </tr>
        </thead>
        <tbody>
          {danhSachSV.map((sv, index) => (
            <tr key={sv.ma_sinh_vien}>
              <td>{index + 1}</td>
              <td>{sv.ma_sinh_vien}</td>
              <td>{`${sv.ho_dem} ${sv.ten}`}</td>
              <td className="score-column" style={{ textAlign: 'center' }}>{sv.tong_diem_sinh_vien}</td>
              <td className="score-column" style={{ textAlign: 'center' }}>{sv.tong_diem_lop_truong}</td>
              
              {/* Cột động cho Cố vấn */}
              {userRole === 'giangvien' && (
                <>
                  <td style={{ textAlign: 'center', fontWeight: 'bold', color: 'black' }}>
                    {editedScores[sv.ma_sinh_vien] || 0}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button className="xds-btn-copy" onClick={() => handleCopyRow(sv)}>
                      Sao chép
                    </button>
                  </td>
                </>
              )}

              {/* Cột động cho Trưởng khoa */}
              {userRole === 'truongkhoa' && (
                <>
                  <td style={{ textAlign: 'center' }}>{sv.tong_diem_co_van}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button className="xds-btn-copy" onClick={() => handleCopyRow(sv)}>
                      Sao chép
                    </button>
                  </td>
                  <td className="score-column"style={{ textAlign: 'center', fontWeight: 'bold', color: 'black' }}>
                    {editedScores[sv.ma_sinh_vien] || 0}
                  </td>
                </>
              )}

              <td style={{ textAlign: 'center' }}>
                <button className="xds-btn-xem" onClick={() => handleViewDetails(sv)}>
                  Xem chi tiết
                </button>
              </td>
              <td>{sv.trang_thai}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="xds-buttons">
        <button onClick={handleCopyAll} className="xds-btn-main">
          Sao chép toàn bộ
        </button>
      </div>
    </div>
  );
}