"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "./styles/Header.css";
import logo from "../../../public/logo_nckh.png";

function AppHeader({ children }: { children: React.ReactNode }) {
  const [selectedSemester, setSelectedSemester] = useState(
    "Học kỳ 1, năm học 2023-2024"
  );
  const [openMenu, setOpenMenu] = useState<string | null>(null); // quản lý menu nào đang mở
  const router = useRouter();

  const reloadPage = () => {
    router.push("/students"); // quay về trang Home thay vì reload
  };

  const handleSemesterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedSemester(event.target.value);
  };

  const toggleMenu = (menuName: string) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  const navigateChamDiem = () => {
    setOpenMenu(null); // đóng dropdown ngay khi click
    router.push("/students/formchamdiem");
  };

  const navigateKetQua = () => {
    setOpenMenu(null);
    router.push("/students/result");
  };

  const navigateXemds = () => {
    setOpenMenu(null);
    router.push("/students/classlist");
  };

  return (
    <div className="main-container">
      {/* Header */}
      <header className="header-all">
        <h1>TRƯỜNG ĐẠI HỌC KHOA HỌC - ĐẠI HỌC HUẾ</h1>
      </header>

      {/* Menu */}
      <div className="menu">
        <button
          className="menu-logo-header"
          onClick={reloadPage}
          style={{ cursor: "pointer", background: "none", border: "none" }}
        >
          <img src={logo.src} alt="Logo" />
        </button>

        <div className="menu-buttons">
          {/* Menu 1 */}
          <div className="dropdown">
            <button
              className="menu-button"
              onClick={() => toggleMenu("renluyen")}
            >
              Quản lý điểm rèn luyện{" "}
              <span>{openMenu === "renluyen" ? "▲" : "▼"}</span>
            </button>
            {openMenu === "renluyen" && (
              <div className="dropdown-content">
                <button onClick={navigateChamDiem}>
                  Đánh giá điểm rèn luyện
                </button>
                <button onClick={navigateKetQua}>Kết quả rèn luyện</button>
                <button onClick={navigateXemds}>
                  Xem danh sách sinh viên trong lớp
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Học kỳ */}
        <div className="semester-row">
          <div className="semester-box">
            <span className="semester-label">Khóa học:</span>
            <span className="semester-value">46 (2022-2026)</span>
          </div>
          <div className="semester-box">
            <span className="semester-label">Học kỳ:</span>
            <select
              className="semester-dropdown"
              value={selectedSemester}
              onChange={handleSemesterChange}
            >
              <option value="Học kỳ 1, năm học 2023-2024">
                Học kỳ 1, năm học 2023-2024
              </option>
              <option value="Học kỳ 2, năm học 2023-2024">
                Học kỳ 2, năm học 2023-2024
              </option>
              <option value="Học kỳ 1, năm học 2024-2025">
                Học kỳ 1, năm học 2024-2025
              </option>
              <option value="Học kỳ 2, năm học 2024-2025">
                Học kỳ 2, năm học 2024-2025
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Nội dung chính */}
      {children && <div className="content-container">{children}</div>}
    </div>
  );
}

export default AppHeader;