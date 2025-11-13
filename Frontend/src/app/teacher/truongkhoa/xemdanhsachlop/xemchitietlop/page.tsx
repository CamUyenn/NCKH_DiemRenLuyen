"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "./../../../../styles/teachers/xemdssinhvien.css";
import { studentsInClassData } from "./data";

function TruongKhoaXemChiTietLop() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const classId = searchParams.get("id") || "1";

  // Get students for this class
  const students = studentsInClassData[classId] || [];

  // State for Khoa scores (initially set from data)
  const [khoaScores, setKhoaScores] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    students.forEach((student) => {
      initial[student.studentId] = student.khoa;
    });
    return initial;
  });

  // Copy all from Cố vấn to Khoa
  const handleCopyAllFromCovan = () => {
    const copiedScores: Record<string, number> = {};
    students.forEach((student) => {
      copiedScores[student.studentId] = student.covan;
    });
    setKhoaScores(copiedScores);
  };

  // Copy individual score from Cố vấn
  const handleCopyFromCovan = (studentId: string, covanScore: number) => {
    setKhoaScores((prev) => ({
      ...prev,
      [studentId]: covanScore,
    }));
  };

  const handleSave = () => {
    // Save scores to localStorage or backend
    localStorage.setItem(`khoaScores_${classId}`, JSON.stringify(khoaScores));
    alert("Đã lưu bảng điểm thành công!");
    router.push("/teacher/truongkhoa/xemdanhsachlop");
  };

  return (
    <div>
      <div className="xemds_students-container">
        <h2>Danh sách sinh viên trong lớp</h2>
        <table className="xemds_students-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Họ và tên Sinh viên</th>
              <th>SV</th>
              <th>BCS</th>
              <th>Cố vấn</th>
              <th>Khoa</th>
              <th>Chi tiết</th>
              <th>Sao chép</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student.id}>
                <td>{index + 1}</td>
                <td>{student.name}</td>
                <td>{student.sv}</td>
                <td>{student.bcs}</td>
                <td>{student.covan}</td>
                <td>
                  <input
                    type="number"
                    value={khoaScores[student.studentId] || ""}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      setKhoaScores((prev) => ({
                        ...prev,
                        [student.studentId]: value,
                      }));
                    }}
                    style={{
                      width: "60px",
                      textAlign: "center",
                      padding: "5px",
                    }}
                  />
                </td>
                <td>
                  <span
                    style={{
                      cursor: "pointer",
                      color: "#007bff",
                      textDecoration: "underline",
                    }}
                    onClick={() => {
                      // Navigate to individual student detail
                      router.push(
                        `/teacher/truongkhoa/xemdanhsachlop/xemchitietsinhvien?classId=${classId}&studentId=${student.studentId}`
                      );
                    }}
                  >
                    Xem
                  </span>
                </td>
                <td>
                  <button
                    onClick={() =>
                      handleCopyFromCovan(student.studentId, student.covan)
                    }
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontSize: "12px",
                    }}
                  >
                    Sao chép
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="xemds_students-buttons">
          <button
            onClick={handleCopyAllFromCovan}
            className="xemds_students-btn"
          >
            Sao chép toàn bộ
          </button>
          <button onClick={handleSave} className="xemds_students-btn">
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}

export default TruongKhoaXemChiTietLop;
