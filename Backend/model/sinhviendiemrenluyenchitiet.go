package model

type SinhVienDiemRenLuyenChiTiet struct {
	MaSinhVienDiemRenLuyenChiTiet string `json:"ma_sinh_vien_diem_ren_luyen_chi_tiet" gorm:"primaryKey"`
	MaSinhVien                    string `json:"ma_sinh_vien"`
	MaBangDiem                    string `json:"ma_bang_diem"`
	DiemSinhVienDanhGia           int    `json:"diem_sinh_vien_danh_gia"`
	DiemLopTruongDanhGia          int    `json:"diem_lop_truong_danh_gia"`
	DiemGiangVienDanhGia          int    `json:"diem_giang_vien_danh_gia"`
	DiemTruongKhoaDanhGia         int    `json:"diem_truong_khoa_danh_gia"`
	DiemChuyenVienDaoTao          int    `json:"diem_chuyen_vien_dao_tao"`
	XepLoai                       string `json:"xep_loai"`
}
