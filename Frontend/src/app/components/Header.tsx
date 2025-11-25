"use client";

import React, { useEffect, useState } from "react";
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

function convertMaHocKyToLabel(maHocKy: string): string {
  // Ví dụ: 2019-2020.2 => Học kỳ 2, năm học 2019-2020
  const match = maHocKy.match(/^(\d{4}-\d{4})\.(\d)$/);
  if (match) {
    return `Học kỳ ${match[2]}, Năm học ${match[1]}`;
  }
  return maHocKy;
}

function AppHeader({
  children,
  logo,
  homeRoute = "/students",
  dropdownMenus = [],
  simpleMenus = [],
  userRole = "student",
}: AppHeaderProps) {
  const [selectedSemester, setSelectedSemester] = useState<string>(""); // <-- sửa lại mặc định
  const [semesterOptions, setSemesterOptions] = useState<{ value: string; label: string }[]>([]);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [localDropdowns, setLocalDropdowns] = useState<DropdownMenu[] | null>(null);
  const [localSimples, setLocalSimples] = useState<SimpleMenu[] | null>(null);

  const router = useRouter();

  const reloadPage = () => {
    router.push(homeRoute);
  };

  const handleSemesterChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newHocKy = event.target.value;
    setSelectedSemester(newHocKy);

    // Lấy session hiện tại
    let session = null;
    try {
      session = JSON.parse(localStorage.getItem("session") || "{}");
    } catch {}
    const maNguoiDung = session?.ma_sinh_vien || session?.ma_giang_vien || "";
    const type = (session?.type || "").toLowerCase();

    // Gọi API đổi học kỳ
    try {
      console.log("Gửi yêu cầu đổi học kỳ:", {
        ma_hoc_ky: newHocKy,
        ma_nguoi_dung: maNguoiDung,
        type: type,
      });
      const res = await fetch("http://localhost:8080/api/doihocky", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ma_hoc_ky: newHocKy,
          ma_nguoi_dung: maNguoiDung,
          type: type,
        }),
      });
      if (!res.ok) {
        console.error("Đổi học kỳ thất bại! Status:", res.status, res.statusText);
        alert("Đổi học kỳ thất bại!");
        return;
      }
      const data = await res.json();
      console.log("Kết quả trả về từ API đổi học kỳ:", data);
      // Cập nhật lại session trong localStorage
      const newSession = { ...session, ...data, ma_hoc_ky: newHocKy, type: data.type };
      localStorage.setItem("session", JSON.stringify(newSession));
      console.log("Session sau khi đổi học kỳ:", newSession);
      window.location.reload();
    } catch (err) {
      console.error("Lỗi khi đổi học kỳ:", err);
      alert("Lỗi khi đổi học kỳ!");
    }
  };

  const toggleMenu = (menuName: string) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  const handleMenuClick = (onClick: () => void) => {
    setOpenMenu(null); // đóng dropdown khi click
    onClick();
  };

  // ------------------------- FETCH DANH SÁCH HỌC KỲ -------------------------
  useEffect(() => {
    // Lấy session từ localStorage
    let session = null;
    try {
      session = JSON.parse(localStorage.getItem("session") || "{}");
    } catch {}
    const maNguoiDung = session?.ma_sinh_vien || session?.ma_giang_vien || "";
    const type = (session?.type || "").toLowerCase();
    const maHocKyHienTai = session?.ma_hoc_ky || "";

    // Thêm log kiểm tra
    console.log("Session:", session);
    console.log("Mã học kỳ hiện tại trong session:", maHocKyHienTai);

    if (!maNguoiDung || !type) {
      setSemesterOptions([]);
      setSelectedSemester("");
      return;
    }

    fetch(`http://localhost:8080/api/xemdanhsachhocky/${maNguoiDung}/${type}`)
      .then((res) => {
        if (!res.ok) {
          console.error("API trả về lỗi:", res.status, res.statusText);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) {
          console.warn("Không lấy được dữ liệu học kỳ từ API.");
          setSemesterOptions([]);
          setSelectedSemester("");
          return;
        }
        // data.list_hocky có thể là mảng string hoặc mảng object
        let arr: string[] = [];
        if (Array.isArray(data.list_hocky)) {
          if (typeof data.list_hocky[0] === "string") {
            arr = data.list_hocky;
          } else if (typeof data.list_hocky[0] === "object" && data.list_hocky[0].ma_hoc_ky) {
            arr = data.list_hocky.map((hk: any) => hk.ma_hoc_ky);
          }
        }
        // Log danh sách học kỳ lấy được từ API
        console.log("Danh sách học kỳ từ API:", arr);

        // Đảm bảo mã học kỳ hiện tại luôn có trong options
        const allArr = arr.includes(maHocKyHienTai) ? arr : [maHocKyHienTai, ...arr];
        const uniqueArr = Array.from(new Set(allArr.filter(Boolean)));

        setSemesterOptions(
          uniqueArr.map((ma) => ({
            value: ma,
            label: convertMaHocKyToLabel(ma),
          }))
        );
        setSelectedSemester(maHocKyHienTai || (uniqueArr.length ? uniqueArr[0] : ""));
      })
      .catch((err) => {
        console.error("Lỗi fetch API học kỳ:", err);
        setSemesterOptions([]);
        setSelectedSemester("");
      });
  }, []);
  // -------------------------------------------------------------------------

  // -------------------------
  // Phần xử lý: đọc session từ localStorage
  // và quyết định hiển thị menu dựa trên trường "type"
  // Không thay đổi giao diện, chỉ thay đổi xử lý menu
  // -------------------------
  useEffect(() => {
    try {
      // 1. cố gắng lấy object session từ một số key hay dùng
      const possibleKeys = ["session", "user", "userSession", "authSession"];
      let raw: string | null = null;
      for (const k of possibleKeys) {
        const v = localStorage.getItem(k);
        if (v) {
          // heuristics: nếu chuỗi có "ma_sinh_vien" hoặc "ma_giang_vien" hoặc "type" thì dùng
          if (v.includes("ma_sinh_vien") || v.includes("ma_giang_vien") || v.includes('"type"')) {
            raw = v;
            break;
          }
          // otherwise keep first found as fallback
          if (!raw) raw = v;
        }
      }

      // 2. nếu không tìm thấy object, thử đọc trực tiếp keys riêng lẻ
      let sessionObj: any = null;
      if (raw) {
        try {
          sessionObj = JSON.parse(raw);
        } catch (e) {
          // not JSON -> ignore
          sessionObj = null;
        }
      }

      if (!sessionObj) {
        // try direct keys
        const direct: any = {};
        if (localStorage.getItem("ma_sinh_vien")) direct.ma_sinh_vien = localStorage.getItem("ma_sinh_vien");
        if (localStorage.getItem("ma_giang_vien")) direct.ma_giang_vien = localStorage.getItem("ma_giang_vien");
        if (localStorage.getItem("ma_hoc_ky")) direct.ma_hoc_ky = localStorage.getItem("ma_hoc_ky");
        if (localStorage.getItem("type")) direct.type = localStorage.getItem("type");
        if (Object.keys(direct).length > 0) sessionObj = direct;
      }

      const typeRaw = sessionObj?.type ?? null;
      const typeStr = typeof typeRaw === 'string' ? typeRaw.toLowerCase() : String(typeRaw).toLowerCase();

      // helper để push router (nếu cần bạn có thể thay đường dẫn)
      const goto = (path: string) => () => router.push(path);

      // menu mẫu theo yêu cầu (giữ nguyên giao diện)
      const rènLuyệnDropdownAll: DropdownMenu = {
        title: "Quản lý điểm rèn luyện",
        buttons: [
          { label: "Đánh giá điểm rèn luyện", onClick: goto("/students/formchamdiem") },
          { label: "Kết quả rèn luyện", onClick: goto("/students/ketquarenluyen") },
          { label: "Xem danh sách sinh viên trong lớp", onClick: goto("/students/xemdssinhvien") },
        ],
      };

      // build local menus based on type
      let dd: DropdownMenu[] = [];
      let sm: SimpleMenu[] = [];

      // nếu userRole là admin -> giữ nguyên như cũ (không override)
      if (userRole === "admin") {
        setLocalDropdowns(null);
        setLocalSimples(null);
        return;
      }

      // map loại chung
      if (!typeStr) {
        // không có type -> fallback: dùng props
        setLocalDropdowns(null);
        setLocalSimples(null);
        return;
      }

      // các điều kiện phân loại: chấp nhận nhiều giá trị đầu vào
      const isStudent = /sv|sinh|student/.test(typeStr);
      const isLopTruong = /loptruong|lop-truong|classleader|class_leader/.test(typeStr);
      const isGiangVien = /gv|giangvien|teacher/.test(typeStr);
      const isTruongKhoa = /truongkhoa|head|truong-khoa/.test(typeStr);
      const isChuyenVien = /chuyenvien|chuyenvien|chuyenviendaotao|daotao/.test(typeStr);

      if (isStudent) {
        // giống hình nhưng không có mục cuối -> chỉ hai mục đầu
        dd = [{
          ...rènLuyệnDropdownAll,
          buttons: rènLuyệnDropdownAll.buttons.slice(0, 2),
        }];
      } else if (isLopTruong) {
        // giống hình (full)
        dd = [rènLuyệnDropdownAll];
      } else if (isGiangVien || isTruongKhoa) {
        // hiển thị nút bấm là xem danh sách lớp
        sm = [
          { label: "Xem danh sách lớp", onClick: goto("#/danh-sach-lop") },
        ];
      } else if (isChuyenVien) {
        // hiển thị xem danh sách khoa
        sm = [
          { label: "Xem danh sách khoa", onClick: goto("#/danh-sach-khoa") },
        ];
      } else {
        // fallback: dùng props
        setLocalDropdowns(null);
        setLocalSimples(null);
        return;
      }

      // set state để render override menus
      setLocalDropdowns(dd);
      setLocalSimples(sm);
    } catch (e) {
      // nếu lỗi, không override
      setLocalDropdowns(null);
      setLocalSimples(null);
      console.error("AppHeader: error reading session for menu override", e);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // chọn menus để render: ưu tiên local override nếu không null
  const dropdownsToRender = localDropdowns ?? dropdownMenus;
  const simplesToRender = localSimples ?? simpleMenus;

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
          <img src={logo?.src || defaultLogo.src} alt="Logo" />
        </button>

        <div className="menu-buttons">
          {/* Render các simple menu (không dropdown) */}
          {simplesToRender.map((menu, index) => (
            <button
              key={`simple-${index}`}
              className="menu-button simple-menu"
              onClick={menu.onClick}
            >
              {menu.label}
            </button>
          ))}

          {/* Render các dropdown menu */}
          {dropdownsToRender.map((menu, index) => (
            <div key={`dropdown-${index}`} className="dropdown">
              <button
                className="menu-button"
                onClick={() => toggleMenu(menu.title)}
              >
                {menu.title} <span>{openMenu === menu.title ? "▲" : "▼"}</span>
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
              <span className="semester-label">Học kỳ:</span>
              <select
                className="semester-dropdown"
                value={selectedSemester}
                onChange={handleSemesterChange}
              >
                {semesterOptions.length === 0 ? (
                  <option value="">Không có học kỳ</option>
                ) : (
                  semesterOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))
                )}
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