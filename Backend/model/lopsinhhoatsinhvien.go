package model

type LopSinhHoatSinhVien struct {
	MaLopSinhHoatSinhVien string `json:"ma_lop_sinh_hoat_sinh_vien" gorm:"primaryKey"`
	MaSinhVien            string `json:"ma_sinh_vien"`
	MaLopSinhHoat         string `json:"ma_lop_sinh_hoat"`
	MaHocKy               string `json:"ma_hoc_ky"`
	DiemRenLuyen          int    `json:"diem_ren_luyen"`
}
