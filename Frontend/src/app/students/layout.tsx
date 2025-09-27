'use client';

import './../styles/Layout.css';
import AppHeader from './../components/Header';
import { usePathname, useRouter } from 'next/navigation';
import AppFooter from "./../components/Footer";
import SidebarFormLayout from './../components/Sidebar';
import tintuc from './../../../public/tintuc_thongbao.png'
import userprofile from './../../../public/userprofile.png'
import logout from './../../../public/logout.png'
import studentOfficeLogo from './../../../public/logo_nckh.png'
import Image from 'next/image';

export default function StudentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const sidebarItems = [
    {icon: <Image src={tintuc} alt="Tin tức" width={24} height={24} />, label: 'Tin tức - Thông báo', path: '/students' },
    {icon: <Image src={userprofile} alt="Tài khoản" width={24} height={24} />, label: 'Thông tin tài khoản', path: '/students/userprofile' },
    {icon: <Image src={logout} alt="Đăng xuất" width={24} height={24} />, label: 'Đăng xuất', path: '/students/logout' },
  ];

  // Định nghĩa menu dựa trên pathname
  const getHeaderProps = () => {
    // Menu cho trang quản lý điểm rèn luyện (formchamdiem, result, classlist)
    if (pathname.includes('/formchamdiem') || pathname.includes('/result') || pathname.includes('/userprofile')) {
      return {
        dropdownMenus: [
          {
            title: "Quản lý điểm rèn luyện",
            buttons: [
              {
                label: "Đánh giá điểm rèn luyện",
                onClick: () => router.push("/students/formchamdiem")
              },
              {
                label: "Kết quả rèn luyện", 
                onClick: () => router.push("/students/result")
              },
              {
                label: "Xem danh sách sinh viên trong lớp",
                onClick: () => router.push("/students/userprofile")
              }
            ]
          }
        ],
        simpleMenus: []
      };
    }
    
    // Menu cho trang danh sách sinh viên hoặc trang chính
    if (pathname === '/students' || pathname.includes('/userprofile') || pathname.includes('/logout')) {
      return {
        simpleMenus: [
          {
            label: "Xem danh sách sinh viên",
            onClick: () => router.push("/students/xemdanhsach") 
          }
        ],
        dropdownMenus: []
      };
    }

    // Default: không có menu
    return {
      simpleMenus: [],
      dropdownMenus: []
    };
  };

  const headerProps = {
    simpleMenus: [],
    dropdownMenus: [
      {
        title: "Quản lý điểm rèn luyện",
        buttons: [
          {
            label: "Đánh giá điểm rèn luyện",
            onClick: () => router.push("/students/formchamdiem")
          },
          {
            label: "Kết quả rèn luyện",
            onClick: () => router.push("/students/result")
          },
          {
            label: "Xem danh sách sinh viên trong lớp",
            onClick: () => router.push("/students/userprofile")
          }
        ]
      }
    ]
  };

  return (
    <>
      {/* Header */}
      {pathname !== '/' && (
        <AppHeader 
          logo={studentOfficeLogo}
          homeRoute="/students"
          simpleMenus={headerProps.simpleMenus}
          dropdownMenus={headerProps.dropdownMenus}
          userRole="student"
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