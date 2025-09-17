"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "./../styles/HeaderTeacher.css";
import logo from "../../../public/logo_nckh.png";

function AppHeader({ children }: { children: React.ReactNode }) {
  const [selectedSemester, setSelectedSemester] = useState(
    "Học kỳ 1, năm học 2023-2024"
  );
  const [openMenu, setOpenMenu] = useState<string | null>(null); // quản lý menu nào đang mở
  const router = useRouter();

  const reloadPage = () => {
    router.push("/teacher"); // quay về trang Home thay vì reload
  };

  const handleSemesterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedSemester(event.target.value);
  };
  const toggleMenu = () => {
    setOpenMenu(null);
    router.push("/teacher/xemdanhsach");
  };

  return (
    <div className="main-container">
      {/* Header */}
      <header className="header-all">
        <h1>TRƯỜNG ĐẠI HỌC KHOA HỌC - ĐẠI HỌC HUẾ</h1>
      </header>

      {/* Menu */}
      <div className="menu-teacher">
        <button
          className="menu-logo-headerteacher"
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
              onClick={() => toggleMenu()}
            >
              Xem danh sách sinh viên{" "}
            </button>
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
