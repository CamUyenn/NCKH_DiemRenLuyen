'use client';

import './../styles/Layout.css';
import AppHeader from './../components/Header';
import { usePathname, useRouter } from 'next/navigation';
import AppFooter from "./../components/Footer";
import SidebarFormLayout from './../components/Sidebar';
import Image from 'next/image';

import tintuc from '../../../public/tintuc_thongbao.png';
import logout from '../../../public/logout.png';
import studentOfficeLogo from '../../../public/logo_teacher.png';

export default function StudentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // Kiểm tra role từ localStorage
  let sessionType = "";
  if (typeof window !== "undefined") {
    try {
      const session = JSON.parse(localStorage.getItem("session") || "{}");
      sessionType = session?.type || "";
    } catch {}
  }
  const isTeacher = sessionType.toLowerCase().includes("teacher");

  // Sidebar menu cho giảng viên
  const sidebarItemsTeacher = [
    { icon: <Image src={tintuc} alt="Tin tức" width={24} height={24} />, label: 'Tin tức - Thông báo', path: '/teacher' },
    { icon: <Image src={logout} alt="Đăng xuất" width={24} height={24} />, label: 'Đăng xuất', path: '/login' },
  ];

  const sidebarItems = isTeacher ? sidebarItemsTeacher : sidebarItemsTeacher;

  // Hàm lấy props cho header dựa vào role
  const getHeaderProps = () => {
    if (isTeacher) {
      return {
        simpleMenus: [
          {
            label: "Xem danh sách sinh viên",
            onClick: () => router.push("/teacher/xemdanhsach"),
          },
        ],
        dropdownMenus: [],
      };
    }
    // Default: không có menu
    return {
      simpleMenus: [],
      dropdownMenus: [],
    };
  };

  const headerProps = getHeaderProps();

  return (
    <>
      {/* Header */}
      {pathname !== '/' && (
        <AppHeader
          logo={studentOfficeLogo}
          homeRoute="/teacher"
          simpleMenus={headerProps.simpleMenus}
          dropdownMenus={headerProps.dropdownMenus}
          userRole={isTeacher ? "teacher" : "student"}
        >
          {null}
        </AppHeader>
      )}

      <div className="main-layout">
        <SidebarFormLayout sidebarItems={sidebarItems} />
        <div className="page-content">{children}</div>
      </div>

      <AppFooter />
    </>
  );
}