package model

type LopSinhHoat struct {
	MaLopSinhHoat string `json:"ma_lop_sinh_hoat" gorm:"primaryKey"`
	TenLop        string `json:"ten_lop"`
	MaDonVi       string `json:"ma_don_vi"`
	DangHoatDong  int    `json:"dang_hoat_dong"`
	MaKhoa        string `json:"ma_khoa"`
	MaNganh       string `json:"ma_nganh"`
}
