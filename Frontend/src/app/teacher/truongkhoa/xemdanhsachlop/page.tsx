"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./../../../styles/teachers/xemdssinhvien.css";
import { classData } from "@/app/teacher/truongkhoa/xemdanhsachlop/data";

function TruongKhoaXemDanhSachLop() {
  const router = useRouter();

  const handleViewDetail = (classId: string) => {
    router.push(`/teacher/truongkhoa/xemdanhsachlop/xemchitietlop?id=${classId}`);
  };

  return (
    <div>
      <div className="xemds_students-container">
        <h2>Danh sách lớp sinh hoạt</h2>
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
            {classData.map((classItem, index) => (
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
                    onClick={() => handleViewDetail(classItem.id)}
                  >
                    Xem
                  </span>
                </td>
                <td>{classItem.trangThai}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TruongKhoaXemDanhSachLop;
