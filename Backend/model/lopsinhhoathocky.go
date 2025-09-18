package model

type LopSinhHoatHocKy struct {
	MaLopSinhHoatHocKy     string `gorm:"size:256;primaryKey" json:"ma_lop_sinh_hoat_hoc_ky"`
	MaHocKyThamChieu       string `gorm:"size:256" json:"ma_hoc_ky_tham_chieu"`
	MaLopSinhHoatThamChieu string `gorm:"size:256" json:"ma_lop_sinh_hoat_tham_chieu"`
	MaLopTruong            string `gorm:"size:256" json:"ma_lop_truong"`
	MaGiangVienCoVan       string `gorm:"size:256" json:"ma_giang_vien_co_van"`
	MaTruongKhoa           string `gorm:"size:256" json:"ma_truong_khoa"`
	MaChuyenVienDaoTao     string `gorm:"size:256" json:"ma_chuyen_vien_dao_tao"`
	TongDiem               int    `json:"tong_diem"`

	Lop   LopSinhHoat `gorm:"foreignKey:MaLopSinhHoatThamChieu;references:MaLopSinhHoat"`
	HocKy HocKy       `gorm:"foreignKey:MaHocKyThamChieu;references:MaHocKy"`
}

func (LopSinhHoatHocKy) TableName() string {
	return "LopSinhHoatHocKy"
}
