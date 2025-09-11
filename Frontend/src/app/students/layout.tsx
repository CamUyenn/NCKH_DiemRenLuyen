'use client';

import './styles/layout.css';
import AppHeader from './../components/Header';
import { usePathname } from 'next/navigation';
import AppFooter from "./../components/Footer";
import SidebarFormLayout from './../components/Sidebar';
import tintuc from './../../../public/tintuc_thongbao.png'
import userprofile from './../../../public/userprofile.png'
import logout from './../../../public/logout.png'
import Image from 'next/image';

export default function StudentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const sidebarItems = [
    {icon: <Image src={tintuc} alt="Tin tức" width={24} height={24} />, label: 'Tin tức - Thông báo', path: '/students' },
    {icon: <Image src={userprofile} alt="Tin tức" width={24} height={24} />, label: 'Thông tin tài khoản', path: '/students/userprofile' },
     {icon: <Image src={logout} alt="Tin tức" width={24} height={24} />, label: 'Đăng xuất', path: '/students/logout' },
  ];

  return (
    <>
      {/* Header */}
      {pathname !== '/' && <AppHeader>{null}</AppHeader>}

      <div className="main-layout">
        <SidebarFormLayout sidebarItems={sidebarItems} />
        <div className="page-content">{children}</div>
      </div>

      <AppFooter />
    </>
  );
}