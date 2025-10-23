"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

function AdminTaoHocKy() {
  const [hocKyOptions, setHocKyOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

useEffect(() => {
  fetch("http://localhost:8080/api/xemhocky")
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data.hocky)) {
        const sorted = [...data.hocky].sort((a, b) => {
          const parseHocKy = (s: string) => {
            const [namHoc, ky] = s.split(".");
            const [namTruoc, namSau] = namHoc.split("-").map(Number);
            return { namTruoc, namSau, ky: Number(ky) };
          };

          const A = parseHocKy(a);
          const B = parseHocKy(b);

          if (A.namTruoc !== B.namTruoc) return A.namTruoc - B.namTruoc;
          if (A.namSau !== B.namSau) return A.namSau - B.namSau;
          return A.ky - B.ky;
        });

        setHocKyOptions(sorted);
      } else {
        setHocKyOptions([]);
      }
    })
    .catch(() => setHocKyOptions([]));
}, []);


  const handleSave = async () => {
    if (!selected) {
      alert("Vui lòng chọn học kỳ!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/taobangdiem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ma_hoc_ky: selected }),
      });
      let data: { error?: string } = {};
      try {
        data = await res.json();
      } catch (err) {
        alert("Dữ liệu trả về từ server không hợp lệ!");
      }
      if (!res.ok || !data || data.error) {
        alert(data.error || "Tạo bảng điểm thất bại!");
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi kết nối tới server!");
    } finally {
      setLoading(false);
      router.push(`/admin/taobangdiem?hocky=${encodeURIComponent(selected)}`);
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "40px auto",
        padding: 24,
        border: "1px solid #ccc",
        borderRadius: 8,
      }}
    >
      <h2 style={{ marginBottom: 24 }}>Chọn học kỳ</h2>
      <div style={{ marginBottom: 24 }}>
        <label style={{ display: "block", marginBottom: 8 }}>Học kỳ:</label>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          style={{ width: "100%", padding: 8 }}
          disabled={loading}
        >
          <option value="">-- Chọn học kỳ --</option>
          {hocKyOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={handleSave}
        disabled={loading}
        style={{
          width: "100%",
          padding: 10,
          background: loading ? "#ccc" : "#003366",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Đang xử lý..." : "Chọn"}
      </button>
    </div>
  );
}

export default AdminTaoHocKy;