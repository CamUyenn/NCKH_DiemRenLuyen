"use client";
import React from "react";
import "./../../styles/students/ketquarenluyen.css";
import { useRouter } from "next/navigation";
const Data = [
  {
    id: 1,
    hocky: "2025-2026.1",
    lopsinhhoat: "CNTTK46_B",
    CVHT: "Đoàn Thị Hồng Phước",
    diem: 85,
    xeploai: "tốt",
  },
  {
    id: 2,
    hocky: "2024-2025.2",
    lopsinhhoat: "CNTTK46_B",
    CVHT: "Đoàn Thị Hồng Phước",
    diem: 78,
    xeploai: "khá",
  },
  {
    id: 3,
    hocky: "2024-2025.1",
    lopsinhhoat: "CNTTK46_B",
    CVHT: "Đoàn Thị Hồng Phước",
    diem: 90,
    xeploai: "xuất sắc",
  },
  {
    id: 4,
    hocky: "2023-2024.2",
    lopsinhhoat: "CNTTK46_B",
    CVHT: "Đoàn Thị Hồng Phước",
    diem: 65,
    xeploai: "trung binh",
  },
  {
    id: 5,
    hocky: "2023-2024.1",
    lopsinhhoat: "CNTTK46_B",
    CVHT: "Đoàn Thị Hồng Phước",
    diem: 88,
    xeploai: "tốt",
  },
  {
    id: 6,
    hocky: "2022-2023.2",
    lopsinhhoat: "CNTTK46_B",
    CVHT: "Đoàn Thị Hồng Phước",
    diem: 72,
    xeploai: "khá",
  },
  {
    id: 7,
    hocky: "2022-2023.1",
    lopsinhhoat: "CNTTK46_B",
    CVHT: "Đoàn Thị Hồng Phước",
    diem: 95,
    xeploai: "xuất sắc",
  },
];

function ResultPage() {
  const router = useRouter();
  const handleclick = () => {
    router.push("/students");
  };
  return (
    <div className="ketqua_students-container">
      <h2>Kết quả rèn luyện</h2>
      <table className="ketqua_students-table">
        <thead>
          <tr>
            <th>Học kỳ</th>
            <th>Lớp sinh hoạt</th>
            <th>Cố vấn học tập</th>
            <th>Điểm rèn luyện</th>
            <th>Xếp loại</th>
          </tr>
        </thead>
        <tbody>
          {Data.map((item) => (
            <tr key={item.id}>
              <td>{item.hocky}</td>
              <td>{item.lopsinhhoat}</td>
              <td>{item.CVHT}</td>
              <td>{item.diem}</td>
              <td>{item.xeploai}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="ketqua_students-buttons">
         <p className="note_ketqua_students">
            <b>Ghi chú:</b> <br/> <i>Điểm rèn luyện được tính theo thang điểm 100, xếp loại theo    
            các mức: Xuất sắc (90-100), Tốt (80-89), Khá (65-79), Trung bình (50-64), Yếu (dưới 50).</i>
        </p>
        <div onClick={handleclick} className="ketqua_students-btn">
          Quay lại
        </div>
       
      </div>
    </div>
  );
}
export default ResultPage;
