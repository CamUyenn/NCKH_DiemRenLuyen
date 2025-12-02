"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "../../styles/teachers/xemdssinhvien.css";

// Định nghĩa kiểu dữ liệu cho sinh viên từ API
type SinhVien = {
  ma_sinh_vien: string;
  ho_dem: string;
  ten: string;
  ten_lop_sinh_hoat: string; 
  trang_thai: string;        
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

  // Hàm xử lý thay đổi điểm (giữ lại logic nếu cần dùng textbox)
  const handleScoreChange = (maSV: string, diem: string) => {
    const newScore = parseInt(diem, 10);
    setEditedScores(prev => ({
      ...prev,
      [maSV]: isNaN(newScore) ? 0 : newScore,
    }));
  };

  // --- HÀM SAO CHÉP ĐIỂM 1 HÀNG (ĐÃ FIX LỖI JSON) ---
  const handleCopyRow = async (sv: SinhVien) => {
    let apiType = "";
    let scoreToCopy = 0;

    // Logic: Cố vấn lấy điểm Lớp trưởng, Trưởng khoa lấy điểm Cố vấn
    if (userRole === 'giangvien') {
      apiType = 'giangvien'; // SỬA LẠI: 'covan' -> 'giangvien' để khớp với backend
      scoreToCopy = sv.tong_diem_lop_truong;
    } else if (userRole === 'truongkhoa') {
      apiType = 'truongkhoa';
      scoreToCopy = sv.tong_diem_co_van;
    } else {
      alert("Quyền của bạn không xác định để thực hiện sao chép.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/saochepdiem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ma_bang_diem: sv.ma_sinh_vien_diem_ren_luyen,
          type: apiType,
        }),
      });

      // Lấy phản hồi dưới dạng text trước để tránh lỗi nếu server trả về rỗng hoặc string
      const textResponse = await res.text();

      // Nếu thành công (200 OK)
      if (res.ok) {
        alert("Sao chép điểm thành công!");
        // Cập nhật UI ngay lập tức
        setEditedScores(prev => ({ ...prev, [sv.ma_sinh_vien]: scoreToCopy }));
      } 
      // Nếu thất bại
      else {
        let errorMessage = "Lỗi không xác định";
        try {
            const result = JSON.parse(textResponse);
            errorMessage = result.message || result.error || textResponse;
        } catch (e) {
            errorMessage = textResponse || errorMessage;
        }
        alert("Sao chép thất bại: " + errorMessage);
      }
    } catch (err: any) {
      console.error("Lỗi copy row:", err);
      alert("Lỗi kết nối server: " + err.message);
    }
  };

  // --- HÀM SAO CHÉP TOÀN BỘ (ĐÃ FIX LỖI JSON) ---
  const handleCopyAll = async () => {
    let apiType = "";
    
    // Xác định type gửi lên API
    if (userRole === 'giangvien') {
      apiType = 'giangvien'; // SỬA LẠI: 'covan' -> 'giangvien' để khớp với backend
    } else if (userRole === 'truongkhoa') {
      apiType = 'truongkhoa';
    } else {
      alert("Quyền không hợp lệ.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/saocheptoanbodiem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          malopsinhhoat: [maLop], // API yêu cầu mảng
          ma_hoc_ky: maHocKy,
          type: apiType,
        }),
      });

      // Lấy phản hồi dưới dạng text
      const textResponse = await res.text();

      // Nếu thành công
      if (res.ok) {
        alert("Sao chép toàn bộ điểm thành công!");
        
        // Cập nhật UI hàng loạt đúng theo logic role
        const newScores: Record<string, number> = {};
        danhSachSV.forEach(sv => {
          let scoreToCopy = 0;
          if (userRole === 'giangvien') {
            scoreToCopy = sv.tong_diem_lop_truong; // Cố vấn lấy của Lớp trưởng
          } else if (userRole === 'truongkhoa') {
            scoreToCopy = sv.tong_diem_co_van;     // Trưởng khoa lấy của Cố vấn
          }
          newScores[sv.ma_sinh_vien] = scoreToCopy;
        });
        setEditedScores(newScores);
      } 
      // Nếu thất bại
      else {
        let errorMessage = "Lỗi không xác định";
        try {
            const result = JSON.parse(textResponse);
            errorMessage = result.message || result.error || textResponse;
        } catch (e) {
            errorMessage = textResponse || errorMessage;
        }
        alert("Sao chép thất bại: " + errorMessage);
      }
    } catch (err: any) {
      console.error("Lỗi copy all:", err);
      alert("Lỗi kết nối server: " + err.message);
    }
  };

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
                  <td className="score-column" style={{ textAlign: 'center', fontWeight: 'bold', color: 'black' }}>
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