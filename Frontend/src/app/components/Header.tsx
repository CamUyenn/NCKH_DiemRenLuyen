"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "./../styles/Header.css";
import defaultLogo from "../../../public/logo_nckh.png";

// Interface định nghĩa props
interface MenuButton {
  label: string;
  onClick: () => void;
}

interface DropdownMenu {
  title: string;
  buttons: MenuButton[];
}

interface SimpleMenu {
  label: string;
  onClick: () => void;
}

interface AppHeaderProps {
  children: React.ReactNode;
  logo?: any; // logo đầy đủ (bao gồm cả hình và chữ)
  homeRoute?: string; // route khi click logo
  dropdownMenus?: DropdownMenu[]; // các menu dropdown
  simpleMenus?: SimpleMenu[]; // các menu đơn giản không dropdown
  userRole?: string; // vai trò: "student", "teacher", "admin"
}

function AppHeader({ 
  children, 
  logo = defaultLogo,
  homeRoute = "/students",
  dropdownMenus = [],
  simpleMenus = [],
  userRole = "student"
}: AppHeaderProps) {
  const [selectedSemester, setSelectedSemester] = useState(
    "Học kỳ 1, năm học 2023-2024"
  );
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const router = useRouter();

  const reloadPage = () => {
    router.push(homeRoute);
  };

  const handleSemesterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedSemester(event.target.value);
  };

  const toggleMenu = (menuName: string) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  const handleMenuClick = (onClick: () => void) => {
    setOpenMenu(null); // đóng dropdown khi click
    onClick();
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
          {/* Render các simple menu (không dropdown) */}
          {simpleMenus.map((menu, index) => (
            <button
              key={`simple-${index}`}
              className="menu-button simple-menu"
              onClick={menu.onClick}
            >
              {menu.label}
            </button>
          ))}

          {/* Render các dropdown menu */}
          {dropdownMenus.map((menu, index) => (
            <div key={`dropdown-${index}`} className="dropdown">
              <button
                className="menu-button"
                onClick={() => toggleMenu(menu.title)}
              >
                {menu.title}{" "}
                <span>{openMenu === menu.title ? "▲" : "▼"}</span>
              </button>
              {openMenu === menu.title && (
                <div className="dropdown-content">
                  {menu.buttons.map((button, buttonIndex) => (
                    <button 
                      key={buttonIndex}
                      onClick={() => handleMenuClick(button.onClick)}
                    >
                      {button.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Học kỳ: chỉ hiển thị nếu không phải admin */}
        {userRole !== "admin" && (
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
        )}
      </div>

      {/* Nội dung chính */}
      {children && <div className="content-container">{children}</div>}
    </div>
  );
}

export default AppHeader;