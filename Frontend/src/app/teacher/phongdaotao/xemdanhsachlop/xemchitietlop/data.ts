// 📁 Data for class detail view - students in a specific class

export interface StudentInClass {
  id: number;
  name: string;
  studentId: string;
  sv: number;    // Điểm sinh viên tự đánh giá
  bcs: number;   // Điểm BCS đánh giá
  covan: number; // Điểm cố vấn đánh giá
  khoa: number;  // Điểm khoa đánh giá
  phongdaotao: number; // Điểm phòng đào tạo đánh giá (will be editable)
}

// 🔹 Mock data for students in a class
export const studentsInClassData: Record<string, StudentInClass[]> = {
  "1": [ // K46A
    {
      id: 1,
      name: "Nguyễn Văn A",
      studentId: "22T102001",
      sv: 80,
      bcs: 80,
      covan: 80,
      khoa: 80,
      phongdaotao: 80,
    },
    {
      id: 2,
      name: "Lê Văn C",
      studentId: "22T102003",
      sv: 90,
      bcs: 87,
      covan: 87,
      khoa: 87,
      phongdaotao: 87,
    },
    {
      id: 3,
      name: "Trần Thị D",
      studentId: "22T102004",
      sv: 70,
      bcs: 75,
      covan: 75,
      khoa: 75,
      phongdaotao: 75,
    },
  ],
  "2": [ // K46B
    {
      id: 4,
      name: "Phạm Văn E",
      studentId: "22T102005",
      sv: 85,
      bcs: 88,
      covan: 90,
      khoa: 90,
      phongdaotao: 90,
    },
    {
      id: 5,
      name: "Hoàng Thị F",
      studentId: "22T102006",
      sv: 92,
      bcs: 91,
      covan: 93,
      khoa: 93,
      phongdaotao: 93,
    },
  ],
  "3": [ // K46C
    {
      id: 6,
      name: "Đỗ Văn G",
      studentId: "22T102007",
      sv: 78,
      bcs: 80,
      covan: 82,
      khoa: 82,
      phongdaotao: 82,
    },
  ],
};
