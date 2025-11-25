"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./../../styles/students/xemdssinhvien.css";

type StudentScore = {
  ma_sinh_vien: string;
  ho_dem: string;
  ten: string;
  ma_sinh_vien_diem_ren_luyen: string;
  trang_thai: string;
  tong_diem_sinh_vien: number;
  xep_loai_sinh_vien: string;
  tong_diem_lop_truong: number;
  xep_loai_lop_truong: string;
  tong_diem_co_van: number;
  xep_loai_co_van: string;
  tong_diem_truong_khoa: number;
  xep_loai_truong_khoa: string;
  tong_diem_chuyen_vien_dao_tao: number;
  xep_loai_chuyen_vien_dao_tao: string;
  ma_lop_sinh_hoat?: string;
  ten_lop_sinh_hoat?: string;
};

function ClassListPage() {
  const router = useRouter();
  const [studentList, setStudentList] = useState<StudentScore[]>([]);
  const [bcsScores, setBcsScores] = useState<Record<string, number>>({});

  // Hàm fetch danh sách sinh viên
  const fetchStudentList = () => {
    let sessionRaw =
      localStorage.getItem("session") ||
      localStorage.getItem("user") ||
      localStorage.getItem("sessionData") ||
      "{}";
    let session = {};
    try {
      session = JSON.parse(sessionRaw);
    } catch {
      session = {};
    }

    const malopsinhhoat =
      (session as any)?.ma_lop_sinh_hoat ||
      (session as any)?.ma_lop ||
      (session as any)?.lop ||
      "";
    const mahocky = (session as any)?.ma_hoc_ky || (session as any)?.ma_hocky || "";

    if (!malopsinhhoat || !mahocky) {
      console.error("Thiếu thông tin mã lớp sinh hoạt hoặc mã học kỳ");
      return;
    }

    const fetchUrl = `http://localhost:8080/api/xemdanhsachbangdiemsinhvien/${malopsinhhoat}/${mahocky}`;

    fetch(fetchUrl)
      .then((res) => res.json())
      .then((data) => {
        const arr = Array.isArray(data.danh_sach_bang_diem_sinh_vien)
          ? data.danh_sach_bang_diem_sinh_vien
          : [];

        const tenlopFromSession =
          (session as any)?.ten_lop_sinh_hoat ||
          (session as any)?.ten_lop ||
          (session as any)?.tenLop ||
          "";

        const submittedStatuses = ["Đã nộp", "Đã Phát"];
        // Chỉ lấy sinh viên chưa được duyệt bởi cấp trên
        const filteredList = arr
          .filter((sv: any) =>
            submittedStatuses.includes(sv.trang_thai) &&
            !(
              sv.tong_diem_co_van > 0 ||
              sv.tong_diem_truong_khoa > 0 ||
              sv.tong_diem_chuyen_vien_dao_tao > 0
            )
          )
          .map((sv: any) => ({
            ...sv,
            ma_lop_sinh_hoat:
              sv.ma_lop_sinh_hoat || sv.ma_lop || malopsinhhoat || "",
            ten_lop_sinh_hoat:
              sv.ten_lop_sinh_hoat || sv.ten_lop || tenlopFromSession || "",
          }));

        setStudentList(filteredList);
      })
      .catch((err) => {
        console.error("Lỗi fetch danh sách sinh viên:", err);
      });
  };

  useEffect(() => {
    fetchStudentList();
  }, []);

  const handleViewDetail = (student: StudentScore) => {
    const maBangDiem = student.ma_sinh_vien_diem_ren_luyen;
    router.push(`/students/xemdssinhvien/xemchitiet?mabd=${maBangDiem}`);
};

  const handleCopyAll = () => {
    const copiedScores: Record<string, number> = {};
    studentList.forEach((student) => {
      copiedScores[student.ma_sinh_vien] = student.tong_diem_sinh_vien;
    });
    setBcsScores(copiedScores);
  };

  const handlesubmit = async () => {
    // Kiểm tra toàn bộ sinh viên đều đã được lớp trưởng đánh giá và trạng thái là "Sinh Viên Đã Chấm"
    const allRated = studentList.every(
      (student) =>
        bcsScores[student.ma_sinh_vien] !== undefined &&
        bcsScores[student.ma_sinh_vien] !== null &&
        student.trang_thai === "Sinh Viên Đã Chấm"
    );

    if (!allRated) {
      alert("Bạn phải đánh giá toàn bộ sinh viên ở cột BCS đánh giá và trạng thái phải là 'Sinh Viên Đã Chấm' trước khi gửi bảng điểm cho cố vấn!");
      return;
    }

    // Lấy danh sách mã bảng điểm
    const maBangDiemArr = studentList.map((student) => student.ma_sinh_vien_diem_ren_luyen);

    try {
      const res = await fetch("http://localhost:8080/api/thaydoitrangthai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mabangdiem: maBangDiemArr,
          type: "loptruong",
        }),
      });
      const result = await res.json();
      if (res.ok) {
        alert("Gửi bảng điểm thành công! Trạng thái đã chuyển sang 'Lớp Trưởng Đã Chấm'.");
        fetchStudentList(); // Cập nhật lại bảng
        router.push("/students");
      } else {
        alert("Gửi bảng điểm thất bại: " + (result.error || "Lỗi không xác định"));
      }
    } catch (err) {
      alert("Lỗi kết nối server!");
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("bangDiemBCS");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const scores: Record<string, number> = {};
        Object.keys(parsed).forEach((studentId) => {
          const val = (parsed as any)[studentId];
          if (typeof val === "number") {
            scores[studentId] = val;
          } else if (val && typeof val === "object" && "diemBCS" in val) {
            scores[studentId] = (val as any).diemBCS;
          }
        });
        setBcsScores(scores);
      } catch (e) {
        console.warn("Không parse được bangDiemBCS từ localStorage", e);
      }
    }
  }, []);

  return (
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
            <th>Sao chép</th>
            <th>BCS đánh giá</th>
            <th>Chi tiết</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {studentList.map((student, index) => (
            <tr key={`${student.ma_sinh_vien}-${index}`}>
              <td>{index + 1}</td>
              <td>{`${student.ho_dem} ${student.ten}`}</td>
              <td>{student.ma_sinh_vien}</td>
              <td>{student.ten_lop_sinh_hoat || student.ma_lop_sinh_hoat || ""}</td>
              <td>
                <span>{student.tong_diem_sinh_vien}</span>
              </td>
              <td>
                <button
                  className="button_copydiem_students"
                  onClick={async () => {
                    try {
                      const res = await fetch("http://localhost:8080/api/saochepdiem", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          ma_bang_diem: student.ma_sinh_vien_diem_ren_luyen,
                          type: "loptruong",
                        }),
                      });
                      const result = await res.json();
                      if (res.ok) {
                        // Lấy điểm sinh viên vừa sao chép và cập nhật vào state
                        setBcsScores((prev) => ({
                          ...prev,
                          [student.ma_sinh_vien]: student.tong_diem_sinh_vien,
                        }));
                        alert("Sao chép điểm thành công!");
                      } else {
                        alert("Sao chép điểm thất bại: " + (result.error || "Lỗi không xác định"));
                      }
                    } catch (err) {
                      alert("Lỗi kết nối server!");
                    }
                  }}
                >
                  Sao chép
                </button>
              </td>
              <td>{bcsScores[student.ma_sinh_vien] ?? ""}</td>
              <td>
                <button
                  className="button_copydiem_students"
                  onClick={() => handleViewDetail(student)}
                >
                  Xem chi tiết
                </button>
              </td>
              <td>{student.trang_thai}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="xemds_students-buttons">
        <button
          onClick={async () => {
            // Lấy thông tin lớp và học kỳ từ session
            let sessionRaw =
              localStorage.getItem("session") ||
              localStorage.getItem("user") ||
              localStorage.getItem("sessionData") ||
              "{}";
            let session = {};
            try {
              session = JSON.parse(sessionRaw);
            } catch {
              session = {};
            }
            const malopsinhhoat =
              (session as any)?.ma_lop_sinh_hoat ||
              (session as any)?.ma_lop ||
              (session as any)?.lop ||
              "";
            const mahocky = (session as any)?.ma_hoc_ky || (session as any)?.ma_hocky || "";

            if (!malopsinhhoat || !mahocky) {
              alert("Thiếu thông tin lớp hoặc học kỳ!");
              return;
            }

            try {
              const res = await fetch("http://localhost:8080/api/saocheptoanbodiem", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  malopsinhhoat: [malopsinhhoat],
                  ma_hoc_ky: mahocky,
                  type: "loptruong",
                }),
              });
              const result = await res.json();
              if (res.ok) {
                // Cập nhật lại state bcsScores cho tất cả sinh viên
                const newScores: Record<string, number> = {};
                studentList.forEach((student) => {
                  newScores[student.ma_sinh_vien] = student.tong_diem_sinh_vien;
                });
                setBcsScores(newScores);

                alert("Sao chép toàn bộ điểm thành công!");
                fetchStudentList(); // Nếu muốn đồng bộ lại bảng
              } else {
                alert("Sao chép thất bại: " + (result.error || "Lỗi không xác định"));
              }
            } catch (err) {
              alert("Lỗi kết nối server!");
            }
          }}
          className="xemds_students-btn"
        >
          Sao chép toàn bộ
        </button>
        <button onClick={handlesubmit} className="xemds_students-btn">
          Gửi bảng điểm
        </button>
      </div>
    </div>
  );
}

export default ClassListPage;
