
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./../../styles/teachers/xemdssinhvien.css";
import { data } from "../../teacher/xemdanhsach/data";

function TeacherXemDanhSach() {
  const router = useRouter();
  const [bcsScores, setBcsScores] = useState<Record<string, number>>({});

  const handleclick = () => {
    router.push("/teacher/xemdanhsach/xemchitiet");
  };
  // 🔹 Sao chép toàn bộ điểm SV sang BCS
  const handleCopyAll = () => {
    const copiedScores: Record<string, number> = {};
    data.forEach((student) => {
      if (student.trangthai === "Đã nộp") {
        copiedScores[student.studentId] = student.diem;
      }
    });
    setBcsScores(copiedScores);
  };
  const handlesubmit = () => {
    alert("Bạn đã gửi bảng điểm thành công!");
    router.push("/teacher");
  };
  useEffect(() => {
    const saved = localStorage.getItem("bangDiemBCS");
    if (saved) {
      const parsed = JSON.parse(saved);
      const scores: Record<string, number> = {};
      Object.keys(parsed).forEach((studentId) => {
        scores[studentId] = parsed[studentId].diemBCS;
      });
      setBcsScores(scores);
    }
  }, []);
  return (
    <div>
      <div className="xemds_students-container">
        <h2>Danh sách sinh viên trong lớp</h2>
        <table className="xemds_students-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Họ và tên</th>
              <th>Mã sinh viên</th>
              <th>Lớp</th>
              <th>Sinh viên tự đánh giá</th>
              <th>BCS đánh giá</th>
              <th>Cố vấn đánh giá</th>
              <th>Chi tiết</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {data.map((student, index) => (
              <tr key={student.id}>
                <td>{index + 1}</td>
                <td>{student.name}</td>
                <td>{student.studentId}</td>
                <td>{student.class}</td>
                <td>
                  {student.trangthai === "Đã nộp" ? (
                    <span>{student.diem}</span>
                  ) : null}
                </td>
                {/* Điểm BCS */}
                <td>
                  {student.trangthai === "Đã nộp" ? (
                    <span>{typeof student.diemBSC !== "undefined" ? student.diemBSC : ""}</span>
                  ) : null}
                </td>
                {/* Điểm Cố vấn */}
                <td>
                  {student.trangthai === "Đã nộp" ? (
                    <span>{typeof student.diemCovan !== "undefined" ? student.diemCovan : ""}</span>
                  ) : null}
                </td>
                <td>
                  {student.trangthai === "Đã nộp" ? (
                    <span
                      className="classlist-link"
                      style={{
                        cursor: "pointer",
                        color: "#007bff",
                        textDecoration: "underline",
                      }}
                      onClick={handleclick}
                    >
                      {student.chitiet}
                    </span>
                  ) : null}
                </td>

                <td>{student.trangthai}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="xemds_students-buttons">
          <button
            onClick={handleCopyAll}
            className="xemds_students-btn"
          >
            Sao chép toàn bộ
          </button>
          <button
            onClick={handlesubmit}
            className="xemds_students-btn"
          >
            Gửi bảng điểm
          </button>
        </div>
      </div>
    </div>
  );
}
export default TeacherXemDanhSach;