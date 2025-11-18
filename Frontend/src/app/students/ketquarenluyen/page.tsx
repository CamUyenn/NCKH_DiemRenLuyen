"use client";
import React, { useEffect, useState } from "react";
import "./../../styles/students/xemdssinhvien.css";

type KetQuaRenLuyen = {
  hocky: string;
  lopsinhhoat: string;
  giangvien: string;
  mabangdiem: string;
  diemsinhvien: number;
  xeploai: string;
};

function KetQuaRenLuyenPage() {
  const [data, setData] = useState<KetQuaRenLuyen[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy mã sinh viên từ session hoặc localStorage
    const sessionRaw =
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
    const masinhvien =
      (session as any)?.ma_sinh_vien ||
      (session as any)?.masv ||
      (session as any)?.id ||
      "";

    if (!masinhvien) {
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8080/api/xemdiemdachamquacacnam/${masinhvien}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="xemds_students-container">
      <h2>Kết quả rèn luyện qua các năm</h2>
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <table className="xemds_students-table">
          <thead>
            <tr>
              <th>Học kỳ</th>
              <th>Lớp sinh hoạt</th>
              <th>Giảng viên cố vấn</th>
              <th>Mã bảng điểm</th>
              <th>Điểm sinh viên</th>
              <th>Xếp loại</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={item.mabangdiem + idx}>
                <td>{item.hocky}</td>
                <td>{item.lopsinhhoat}</td>
                <td>{item.giangvien}</td>
                <td>{item.mabangdiem}</td>
                <td>{item.diemsinhvien}</td>
                <td>{item.xeploai}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default KetQuaRenLuyenPage;
