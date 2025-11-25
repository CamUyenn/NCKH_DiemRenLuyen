"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "../../styles/teachers/xemdssinhvien.css";

// Định nghĩa kiểu dữ liệu cho điểm của một sinh viên
type SinhVienDiem = {
  stt: number;
  ho_ten: string;
  diem_sv: number;
  diem_bcs: number;
  diem_co_van: number;
  diem_khoa: number;
  diem_pdt: number;
};

export default function XemChiTietLop() {
  const router = useRouter();

  // Dữ liệu tĩnh
  const [danhSachDiem, setDanhSachDiem] = useState<SinhVienDiem[]>([
    { stt: 1, ho_ten: "Nguyễn Văn A", diem_sv: 80, diem_bcs: 80, diem_co_van: 80, diem_khoa: 80, diem_pdt: 80 },
    { stt: 2, ho_ten: "Lê Văn C", diem_sv: 90, diem_bcs: 87, diem_co_van: 87, diem_khoa: 87, diem_pdt: 87 },
    { stt: 3, ho_ten: "Trần Thị D", diem_sv: 70, diem_bcs: 75, diem_co_van: 75, diem_khoa: 75, diem_pdt: 75 },
  ]);

  // Các hàm xử lý sự kiện
  const handleViewDetails = (stt: number) => alert(`Xem chi tiết sinh viên STT ${stt}`);
  const handleCopyRow = (stt: number) => alert(`Sao chép điểm sinh viên STT ${stt}`);
  const handleCopyAll = () => alert("Sao chép toàn bộ điểm của lớp!");
  const handleSave = () => alert("Lưu các thay đổi!");

  return (
    <div className="xds-container">
      <h2>Chi tiết điểm rèn luyện lớp [Tên lớp]</h2>
      <table className="xds-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Họ và tên </th>
            <th>Sinh viên</th>
            <th>BCS</th>
            <th>Cố vấn</th>
            <th>Khoa</th>
            <th>PĐT</th>
            <th>Chi tiết</th>
            <th>Sao chép</th>
          </tr>
        </thead>
        <tbody>
          {danhSachDiem.map((sv) => (
            <tr key={sv.stt}>
              <td>{sv.stt}</td>
              <td>{sv.ho_ten}</td>
              <td>{sv.diem_sv}</td>
              <td>{sv.diem_bcs}</td>
              <td>{sv.diem_co_van}</td>
              <td>{sv.diem_khoa}</td>
              <td>{sv.diem_pdt}</td>
              <td>
                <button className="xds-btn-xem" onClick={() => handleViewDetails(sv.stt)}>
                  Xem
                </button>
              </td>
              <td>
                <button className="xds-btn-copy" onClick={() => handleCopyRow(sv.stt)}>
                  Sao chép
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="xds-buttons">
        <button onClick={handleCopyAll} className="xds-btn-main">
          Sao chép toàn bộ
        </button>
        <button onClick={handleSave} className="xds-btn-main xds-btn-save">
          Lưu
        </button>
      </div>
    </div>
  );
}