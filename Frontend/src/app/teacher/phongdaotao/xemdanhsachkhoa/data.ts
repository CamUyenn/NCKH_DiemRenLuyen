// 📁 Data for department (khoa) list

export interface KhoaData {
  id: string;
  tenKhoa: string;
  truongKhoa: string;
  trangThai: string;
}

// 🔹 Danh sách khoa
export const khoaData: KhoaData[] = [
  {
    id: "1",
    tenKhoa: "Công nghệ thông tin",
    truongKhoa: "Nguyễn Hoàng Hà",
    trangThai: "Đã chấm",
  },
  {
    id: "2",
    tenKhoa: "Công nghệ sinh học",
    truongKhoa: "Trần Văn B",
    trangThai: "Chưa chấm",
  },
  {
    id: "3",
    tenKhoa: "Vật lý",
    truongKhoa: "Lê Thị C",
    trangThai: "Đã chấm",
  },
  {
    id: "4",
    tenKhoa: "Hóa học",
    truongKhoa: "Phạm Văn D",
    trangThai: "Chưa chấm",
  },
  {
    id: "5",
    tenKhoa: "Toán học",
    truongKhoa: "Ngô Thị E",
    trangThai: "Đã chấm",
  },
];
