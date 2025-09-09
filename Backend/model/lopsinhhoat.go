package model

type LopSinhHoat struct {
	MaLopSinhHoat string `gorm:"size:256;primaryKey" json:"ma_lop_sinh_hoat"`
	TenLop        string `json:"ten_lop"`
	MaDonVi       string `json:"ma_don_vi"`
	DangHoatDong  int    `json:"dang_hoat_dong"`
	MaKhoa        string `json:"ma_khoa"`
	MaNganh       string `json:"ma_nganh"`

	LopSinhHoatHocKy    []LopSinhHoatHocKy    `gorm:"foreignKey:MaLopSinhHoatThamChieu;references:MaLopSinhHoat"`
	LopSinhHoatSinhVien []LopSinhHoatSinhVien `gorm:"foreignKey:MaLopSinhHoatThamChieu;references:MaLopSinhHoat"`
}

func (LopSinhHoat) TableName() string {
	return "LopSinhHoat"
}
