package model

type LopSinhHoatSinhVien struct {
	MaLopSinhHoatSinhVien  string `gorm:"primaryKey;size:256" json:"ma_lop_sinh_hoat_sinh_vien"`
	MaSinhVienThamChieu    string `gorm:"size:256" json:"ma_sinh_vien_tham_chieu"`
	MaLopSinhHoatThamChieu string `gorm:"size:256" json:"ma_lop_sinh_hoat_tham_chieu"`
	MaHocKyThamChieu       string `gorm:"size:256" json:"ma_hoc_ky_tham_chieu"`
	DiemRenLuyen           int    `json:"diem_ren_luyen"`

	Lop      LopSinhHoat `gorm:"foreignKey:MaLopSinhHoatThamChieu;references:MaLopSinhHoat"`
	SinhVien SinhVien    `gorm:"foreignKey:MaSinhVienThamChieu;references:MaSinhVien"`
	HocKy    HocKy       `gorm:"foreignKey:MaHocKyThamChieu;references:MaHocKy"`
}

func (LopSinhHoatSinhVien) TableName() string {
	return "LopSinhHoatSinhVien"
}
