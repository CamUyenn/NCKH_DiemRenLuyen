// 📁 Data for classes in each department (khoa)

export interface ClassInKhoa {
  id: string;
  tenLop: string;
  cvht: string;
  trangThai: string;
}

// 🔹 Mock data for classes in each khoa
export const classesInKhoaData: Record<string, ClassInKhoa[]> = {
  "1": [ // Công nghệ thông tin
    {
      id: "1",
      tenLop: "K46A",
      cvht: "Lê Quang Chiến",
      trangThai: "Đã chấm",
    },
    {
      id: "2",
      tenLop: "K46B",
      cvht: "Đoàn Thị Hồng Phước",
      trangThai: "Chưa chấm",
    },
    {
      id: "3",
      tenLop: "K47A",
      cvht: "Phạm Văn Cường",
      trangThai: "Đã chấm",
    },
  ],
  "2": [ // Công nghệ sinh học
    {
      id: "4",
      tenLop: "K46C",
      cvht: "Nguyễn Văn An",
      trangThai: "Đã chấm",
    },
    {
      id: "5",
      tenLop: "K46D",
      cvht: "Trần Thị Bình",
      trangThai: "Chưa chấm",
    },
  ],
  "3": [ // Vật lý
    {
      id: "6",
      tenLop: "K47B",
      cvht: "Lê Thị Dung",
      trangThai: "Chưa chấm",
    },
  ],
};
