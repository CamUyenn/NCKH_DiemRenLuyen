export interface Diem {
  muc: string;           // Ví dụ: "I", "1", "a"
  mucCha?: string;       // Ví dụ: "1" (nếu "a" là con của "1")
  mucLevel: number;      // Mức (1->4)
  loai: "checkbox" | "radio" | "none";
  noiDung: string;
  diem?: string;         // +11đ, -5đ/lần, ...
}

export const diemData: Diem[] = [
  // ================== PHẦN I ==================
  { muc: "I", mucLevel: 1, loai: "none", noiDung: "Đánh giá về ý thức trong học tập (0-20đ)" },

  { muc: "1", mucLevel: 2, mucCha: "I", loai: "radio", noiDung: "Kết quả học tập (Chọn 1 tiêu chí phù hợp)" },
  { muc: "a", mucLevel: 3, mucCha: "1", loai: "radio", noiDung: "Có điểm TBCHK từ 3.6 đến 4.00", diem: "+11đ" },
  { muc: "b", mucLevel: 3, mucCha: "1", loai: "radio", noiDung: "Có điểm TBCHK từ 3.2 đến cận 3.6", diem: "+9đ" },
  { muc: "c", mucLevel: 3, mucCha: "1", loai: "radio", noiDung: "Có điểm TBCHK từ 2.8 đến cận 3.2", diem: "+7đ" },
  { muc: "d", mucLevel: 3, mucCha: "1", loai: "radio", noiDung: "Có điểm TBCHK từ 2.0 đến cận 2.5", diem: "+5đ" },
  { muc: "e", mucLevel: 3, mucCha: "1", loai: "radio", noiDung: "Có điểm TBCHK từ 1.2 đến cận 2.0", diem: "+3đ" },
  { muc: "f", mucLevel: 3, mucCha: "1", loai: "radio", noiDung: "Có điểm TBCHK < 1.2", diem: "0đ" },

  { muc: "2", mucLevel: 2, mucCha: "I", loai: "checkbox", noiDung: "Hoạt động nghiên cứu khoa học, thi Olympic (0-5đ)" },
  { muc: "a", mucLevel: 3, mucCha: "2", loai: "checkbox", noiDung: "Thành viên đề tài nghiên cứu khoa học, đội Olympic cấp trường trở lên", diem: "+5đ" },
  { muc: "b", mucLevel: 3, mucCha: "2", loai: "checkbox", noiDung: "Đạt giải tại các cuộc thi về nghiên cứu khoa học từ cấp Khoa trở lên", diem: "+5đ" },

  { muc: "3", mucLevel: 2, mucCha: "I", loai: "checkbox", noiDung: "Ý thức học tập" },
  { muc: "a", mucLevel: 3, mucCha: "3", loai: "checkbox", noiDung: "Tham gia học đầy đủ tất cả các môn", diem: "+3đ" },
  { muc: "b", mucLevel: 3, mucCha: "3", loai: "checkbox", noiDung: "Có thái độ học tập tích cực, đóng góp xây dựng bài trong học tập", diem: "+3đ" },
  { muc: "c", mucLevel: 3, mucCha: "3", loai: "checkbox", noiDung: "Sinh viên khuyết tật, mồ côi, gia đình hộ nghèo... có sĩ số học kỳ trước từ 2.5 trở lên", diem: "+5đ" },
  { muc: "d", mucLevel: 3, mucCha: "3", loai: "checkbox", noiDung: "Có kết quả học tập học kỳ sau cao hơn học kỳ trước (SV năm 1 HK1 +3đ)", diem: "+3đ" },

  { muc: "4", mucLevel: 2, mucCha: "I", loai: "checkbox", noiDung: "Thực hiện nội quy, quy chế học tập" },
  { muc: "a", mucLevel: 3, mucCha: "4", loai: "checkbox", noiDung: "Vi phạm quy chế thi bị khiển trách", diem: "-4đ/lần" },
  { muc: "b", mucLevel: 3, mucCha: "4", loai: "checkbox", noiDung: "Vi phạm quy chế thi bị cảnh cáo", diem: "-6đ/lần" },
  { muc: "c", mucLevel: 3, mucCha: "4", loai: "checkbox", noiDung: "Vi phạm quy chế thi bị đình chỉ học phần", diem: "-10đ/lần" },

  // ================== PHẦN II ==================
  { muc: "II", mucLevel: 1, loai: "none", noiDung: "Đánh giá về ý thức chấp hành nội quy, quy chế, quy định trong nhà trường (0-25đ)"},

  { muc: "1", mucLevel: 2, mucCha: "II", loai: "checkbox", noiDung: "Thực hiện tốt các văn bản chỉ đạo của các cấp được thực hiện trong trường", diem: "+4đ" },
  { muc: "2", mucLevel: 2, mucCha: "II", loai: "checkbox", noiDung: "Được chứng nhận hoàn thành Tuần sinh hoạt công dân - HSSV", diem: "+5đ" },
  { muc: "3", mucLevel: 2, mucCha: "II", loai: "checkbox", noiDung: "Thực hiện tốt nội quy về bảo vệ tài sản và phòng chống lãng phí", diem: "+4đ" },
  { muc: "4", mucLevel: 2, mucCha: "II", loai: "checkbox", noiDung: "Đeo bảng tên theo quy định khi đến trường và thi học kỳ", diem: "+5đ" },
  { muc: "5", mucLevel: 2, mucCha: "II", loai: "checkbox", noiDung: "Thực hiện khai báo đầy đủ/kịp thời thông tin nội, ngoại trú", diem: "+4đ" },
  { muc: "6", mucLevel: 2, mucCha: "II", loai: "checkbox", noiDung: "Khai báo đầy đủ/kịp thời thông tin cá nhân theo quy định", diem: "+4đ" },
  { muc: "7", mucLevel: 2, mucCha: "II", loai: "checkbox", noiDung: "Vắng tựu trường, sinh hoạt lớp, đi học trễ... vi phạm nội quy", diem: "-5đ/lần" },
  { muc: "8", mucLevel: 2, mucCha: "II", loai: "checkbox", noiDung: "Vi phạm nội quy nhà trường bị lập biên bản", diem: "-10đ/lần" },

  // ================== PHẦN III ==================
  { muc: "III", mucLevel: 1, loai: "none", noiDung: "Đánh giá về ý thức và kết quả tham gia các hoạt động chính trị xã hội, văn hóa, văn nghệ, thể thao, phòng chống tội phạm và các tệ nạn xã hội (0-20đ)" },

  { muc: "1", mucLevel: 2, mucCha: "III", loai: "checkbox", noiDung: "Tham gia các hoạt động của khoa, trường (không quá 15đ)", diem: "+3đ/lần" },
  { muc: "2", mucLevel: 2, mucCha: "III", loai: "checkbox", noiDung: "Là thành viên tích cực CLB đội nhóm", diem: "+5đ" },
  { muc: "3", mucLevel: 2, mucCha: "III", loai: "checkbox", noiDung: "Có ý thức tuyên truyền, phòng, chống tội phạm và tệ nạn xã hội", diem: "+5đ" },
  { muc: "4", mucLevel: 2, mucCha: "III", loai: "checkbox", noiDung: "Là thành viên đội tuyên truyền văn hóa, thể thao từ lớp, khoa, trường trở lên", diem: "+5đ" },
  { muc: "5", mucLevel: 2, mucCha: "III", loai: "checkbox", noiDung: "Tham gia Mùa hè xanh, Tiếp sức mùa thi, đạt giải văn nghệ/thể thao", diem: "+10đ" },
  { muc: "6", mucLevel: 2, mucCha: "III", loai: "checkbox", noiDung: "Không tham gia hoạt động bị trừ điểm (theo danh sách ban cán sự)", diem: "-5đ/lần" },

  // ================== PHẦN IV ==================
  { muc: "IV", mucLevel: 1, loai: "none", noiDung: "Đánh giá về ý thức công dân trong quan hệ cộng đồng (0-25đ)" },

  { muc: "1", mucLevel: 2, mucCha: "IV", loai: "checkbox", noiDung: "Có lối sống lành mạnh, lễ phép, chia sẻ giúp đỡ bạn bè", diem: "+10đ" },
  { muc: "2", mucLevel: 2, mucCha: "IV", loai: "checkbox", noiDung: "Chấp hành tốt chủ trương, chính sách của Đảng, pháp luật", diem: "+5đ" },
  { muc: "3", mucLevel: 2, mucCha: "IV", loai: "checkbox", noiDung: "Tham gia các hoạt động nhân đạo, an toàn giao thông, lao động công ích", diem: "+3đ/lần" },
  { muc: "4", mucLevel: 2, mucCha: "IV", loai: "checkbox", noiDung: "Vi phạm pháp luật (chưa đến mức chịu TNHS)", diem: "-10đ/lần" },

  // ================== PHẦN V ==================
  { muc: "V", mucLevel: 1, loai: "none", noiDung: "Đánh giá ý thức, kết quả tham gia phụ trách lớp, đoàn thể, hoặc thành tích đặc biệt (0-10đ)" },

  { muc: "1", mucLevel: 2, mucCha: "V", loai: "checkbox", noiDung: "Thành viên tham gia hỗ trợ tích cực hoạt động lớp, khoa, trường", diem: "+5đ" },
  { muc: "2", mucLevel: 2, mucCha: "V", loai: "checkbox", noiDung: "Là đoàn viên ưu tú, đối tượng Đảng", diem: "+2đ" },
  { muc: "3", mucLevel: 2, mucCha: "V", loai: "checkbox", noiDung: "Đạt thành tích đặc biệt trong học tập và rèn luyện", diem: "+2đ" },
  { muc: "4", mucLevel: 2, mucCha: "V", loai: "checkbox", noiDung: "Ban cán sự lớp, UV BCH Đoàn/Hội SV lớp, khoa; Ban chủ nhiệm CLB đội nhóm", diem: "+2đ" },
  { muc: "5", mucLevel: 2, mucCha: "V", loai: "checkbox", noiDung: "UV BCH Đoàn TN, UV BCH Hội SV cấp trường trở lên", diem: "+2đ" },
];
