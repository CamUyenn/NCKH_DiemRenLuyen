"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "./../../../../styles/teachers/xemdssinhvien.css";
import { classesInKhoaData } from "./data";
import { khoaData } from "../data";

function PhongDaoTaoXemChiTietKhoa() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const khoaId = searchParams.get("id") || "1";

  // Get classes for this khoa
  const classes = classesInKhoaData[khoaId] || [];
  const khoa = khoaData.find((k) => k.id === khoaId);

  const handleViewClassDetail = (classId: string) => {
    router.push(`/teacher/phongdaotao/xemdanhsachlop/xemchitietlop?id=${classId}`);
  };

  return (
    <div>
      <div className="xemds_students-container">
        <h2>Danh sách lớp - {khoa?.tenKhoa || "Khoa"}</h2>
        <table className="xemds_students-table">
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
            {classes.map((classItem, index) => (
              <tr key={classItem.id}>
                <td>{index + 1}</td>
                <td>{classItem.tenLop}</td>
                <td>{classItem.cvht}</td>
                <td>
                  <span
                    className="classlist-link"
                    style={{
                      cursor: "pointer",
                      color: "#007bff",
                      textDecoration: "underline",
                    }}
                    onClick={() => handleViewClassDetail(classItem.id)}
                  >
                    Xem
                  </span>
                </td>
                <td>{classItem.trangThai}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="xemds_students-buttons">
          <button
            onClick={() => router.push("/teacher/phongdaotao/xemdanhsachkhoa")}
            className="xemds_students-btn"
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
}

export default PhongDaoTaoXemChiTietKhoa;
