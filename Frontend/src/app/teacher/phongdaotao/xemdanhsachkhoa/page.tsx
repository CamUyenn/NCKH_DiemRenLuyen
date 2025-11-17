"use client";
import React from "react";
import { useRouter } from "next/navigation";
import "./../../../styles/teachers/xemdssinhvien.css";
import { khoaData } from "./data";

function PhongDaoTaoXemDanhSachKhoa() {
  const router = useRouter();

  const handleViewDetail = (khoaId: string) => {
    router.push(`/teacher/phongdaotao/xemdanhsachkhoa/xemchitietkhoa?id=${khoaId}`);
  };

  const handleSubmit = () => {
    alert("Đã gửi bảng điểm thành công!");
    router.push("/teacher");
  };

  return (
    <div>
      <div className="xemds_students-container">
        <h2>Danh sách khoa</h2>
        <table className="xemds_students-table">
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
            {khoaData.map((khoa, index) => (
              <tr key={khoa.id}>
                <td>{index + 1}</td>
                <td>{khoa.tenKhoa}</td>
                <td>{khoa.truongKhoa}</td>
                <td>
                  <span
                    className="classlist-link"
                    style={{
                      cursor: "pointer",
                      color: "#007bff",
                      textDecoration: "underline",
                    }}
                    onClick={() => handleViewDetail(khoa.id)}
                  >
                    Xem
                  </span>
                </td>
                <td>{khoa.trangThai}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="xemds_students-buttons">
          <button onClick={handleSubmit} className="xemds_students-btn">
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
}

export default PhongDaoTaoXemDanhSachKhoa;
