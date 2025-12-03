package model

type LopSinhHoat struct {
	MaLopSinhHoat   string `gorm:"size:256;primaryKey" json:"ma_lop_sinh_hoat"`
	TenLop          string `json:"ten_lop"`
	MaKhoaThamChieu string `json:"ma_khoa_tham_chieu"`

	LopSinhHoatHocKy    []LopSinhHoatHocKy    `gorm:"foreignKey:MaLopSinhHoatThamChieu;references:MaLopSinhHoat"`
	LopSinhHoatSinhVien []LopSinhHoatSinhVien `gorm:"foreignKey:MaLopSinhHoatThamChieu;references:MaLopSinhHoat"`
}

func (LopSinhHoat) TableName() string {
	return "LopSinhHoat"
}
