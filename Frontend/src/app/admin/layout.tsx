'use client';

import './../styles/Layout.css';
import AppHeader from './../components/Header';
import AppFooter from "./../components/Footer";
import SidebarFormLayout from './../components/Sidebar';
import Image from 'next/image';
import adminLogo from './../../../public/logo_nckh.png';
import tintuc from './../../../public/tintuc_thongbao.png';
import userprofile from './../../../public/userprofile.png';
import logout from './../../../public/logout.png';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Sidebar cho admin, sửa lại path cho đúng
  const sidebarItems = [
    {icon: <Image src={tintuc} alt="Home" width={24} height={24} />, label: 'Tin tức - Thông báo', path: '/admin' },
    {icon: <Image src={userprofile} alt="Thông tin admin" width={24} height={24} />, label: 'Thông tin admin', path: '/admin/userprofile' },
    {icon: <Image src={logout} alt="Đăng xuất" width={24} height={24} />, label: 'Đăng xuất', path: '/login' },
  ];

  return (
    <>
      <AppHeader
        logo={adminLogo}
        homeRoute="/admin"
        simpleMenus={[]} // Không có menu
        dropdownMenus={[]} // Không có menu
        userRole="admin"
      >
        {null}
      </AppHeader>

      <div className="main-layout">
        <SidebarFormLayout sidebarItems={sidebarItems} />
        <div className="page-content">{children}</div>
      </div>

      <AppFooter />
    </>
  );
}