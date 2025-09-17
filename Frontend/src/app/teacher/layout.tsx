'use client';

import './../styles/LayoutTeacher.css';
import AppHeader from './../components/HeaderTeacher';
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
    {icon: <Image src={tintuc} alt="Tin tức" width={24} height={24} />, label: 'Thông báo', path: '/teacher' },
    {icon: <Image src={userprofile} alt="Tài khoản" width={24} height={24} />, label: 'Thông tin tài khoản', path: '/teacher/teacherprofile' },
    {icon: <Image src={logout} alt="Đăng xuất" width={24} height={24} />, label: 'Đăng xuất', path: '/teacher/logout'},
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