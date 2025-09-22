'use client';

import './../styles/LayoutStudent.css';
import AppHeader from './../components/Header';
import { usePathname, useRouter } from 'next/navigation';
import AppFooter from "./../components/Footer";
import SidebarFormLayout from './../components/Sidebar';
import Image from 'next/image';

import tintuc from '../../../public/tintuc_thongbao.png';
import userprofile from '../../../public/userprofile.png';
import logout from '../../../public/logout.png';
import studentOfficeLogo from '../../../public/logo_nckh.png';

export default function StudentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // Sidebar menu cho sinh viên
  const sidebarItems = [
    { icon: <Image src={tintuc} alt="Tin tức" width={24} height={24} />, label: 'Tin tức - Thông báo', path: '/students' },
    { icon: <Image src={userprofile} alt="Tài khoản" width={24} height={24} />, label: 'Thông tin tài khoản', path: '/students/userprofile' },
    { icon: <Image src={logout} alt="Đăng xuất" width={24} height={24} />, label: 'Đăng xuất', path: '/students/logout' },
  ];

  // Hàm lấy props cho header dựa vào pathname
  const getHeaderProps = () => {
    if (pathname === '/teacher' || pathname.includes('/userprofile') || pathname.includes('/logout')) {
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
          userRole="teacher"
        >
          {/* Nếu không có nội dung gì cho header, truyền null */}
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