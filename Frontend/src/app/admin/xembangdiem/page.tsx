"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "./../../styles/Admin/BangDiem.css";

interface BangDiemChiTiet {
  ma_tieu_chi: string;
  ma_bang_diem_tham_chieu: string;
  ten_tieu_chi: string;
  muc_diem: number;
  muc: string;
  diem: number;
  mo_ta_diem: string;
  ma_tieu_chi_cha: string;
  loai_tieu_chi: string;
  so_lan: number;
}

export default function BangDiem() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const raw = searchParams.get("raw"); // lấy raw từ URL hiện tại

  const [diemData, setDiemData] = useState<BangDiemChiTiet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!raw) return;
    fetch(`http://localhost:8080/api/xemtieuchi/${raw}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("API data:", data);
        setDiemData(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setDiemData([]);
        setLoading(false);
      });
  }, [raw]);

  // Tách năm học và học kỳ từ raw
  let namHoc = "";
  let hocKy = "";
  if (raw) {
    const match = raw.match(/^([0-9\-]+)\.(\d)_BD/);
    if (match) {
      namHoc = match[1];
      hocKy = match[2];
    }
  }

  function handleCreate() {
    if (raw) {
      router.push(`/admin/chinhsuabangdiem?raw=${raw}`);
    } else {
      alert("Không tìm thấy thông tin raw trong URL!");
    }
  }

  function handleCopy() {
    if (!raw) {
      alert("Không tìm thấy thông tin raw trong URL!");
      return;
    }
    // Lưu dữ liệu hiện tại vào localStorage
    localStorage.setItem("bangdiem_sao_chep", raw);
    router.push(`/admin/saochephocky`);
  }

  function sortBangDiem(data: BangDiemChiTiet[]) {
    // Duyệt theo đúng thứ tự xuất hiện trong data
    let result: BangDiemChiTiet[] = [];

    // Tạo map mã tiêu chí -> item
    const maMap = new Map<string, BangDiemChiTiet>();
    data.forEach(item => maMap.set(item.ma_tieu_chi, item));

    // Hàm đệ quy để duyệt con theo đúng thứ tự nhập
    function pushWithChildren(item: BangDiemChiTiet) {
      if (result.find(i => i.ma_tieu_chi === item.ma_tieu_chi)) return;
      result.push(item);
      // Tìm các con theo đúng thứ tự xuất hiện trong data
      const children = data.filter(i => i.ma_tieu_chi_cha === item.ma_tieu_chi);
      for (const child of children) {
        pushWithChildren(child);
      }
    }

    // Duyệt từng item theo thứ tự nhập, nếu là gốc (không có cha hoặc cha không tồn tại) thì bắt đầu từ đó
    for (const item of data) {
      if (!item.ma_tieu_chi_cha || !maMap.has(item.ma_tieu_chi_cha)) {
        pushWithChildren(item);
      }
    }

    // Thêm các mục bị lạc (không duyệt tới)
    const resultIds = new Set(result.map(i => i.ma_tieu_chi));
    const missing = data.filter(i => !resultIds.has(i.ma_tieu_chi));
    return [...result, ...missing];
  }

  return (
    <div className="bangDiem-container">
      <h2>Bảng điểm rèn luyện</h2>
      {namHoc && hocKy && (
        <div style={{ fontWeight: 600, color: "#003366", marginBottom: 8 }}>
          Năm học: {namHoc} &nbsp;|&nbsp; Học kỳ: {hocKy}
        </div>
      )}
      {loading ? (
        <div>Đang tải dữ liệu...</div>
      ) : (
        <table className="bangDiem-table">
          <thead>
            <tr>
              <th>Mục</th>
              <th>Nội dung đánh giá</th>
              <th>Mô tả</th>
              <th>Điểm</th>
            </tr>
          </thead>
          <tbody>
            {diemData.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", color: "#888" }}>
                  Không có dữ liệu bảng điểm
                </td>
              </tr>
            ) : (
              sortBangDiem(diemData).map((item, index) => (
                <tr key={item.ma_tieu_chi}>
                  <td>{item.muc}</td>
                  <td>{item.ten_tieu_chi}</td>
                  <td>{item.mo_ta_diem}</td>
                  <td>{item.diem}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      <div className="bangDiem-buttons">
        <button onClick={handleCopy} className="bangDiem-btn">
          Sao chép bảng điểm
        </button>
        <button onClick={handleCreate} className="bangDiem-btn">
          Chỉnh sửa bảng điểm
        </button>
      </div>
    </div>
  );
}
