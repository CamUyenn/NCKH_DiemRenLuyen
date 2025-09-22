package model

type HocKy struct {
	MaHocKy string `gorm:"size:256;primaryKey" json:"ma_hoc_ky"`
	HocKy   int    `json:"hoc_ky"`
	NamHoc  string `json:"nam_hoc"`

	LopSinhHoatHocKy     []LopSinhHoatHocKy     `gorm:"foreignKey:MaHocKyThamChieu;references:MaHocKy"`
	BangDiem             []BangDiem             `gorm:"foreignKey:MaHocKyThamChieu;references:MaHocKy"`
	LopSinhHoatSinhVien  []LopSinhHoatSinhVien  `gorm:"foreignKey:MaHocKyThamChieu;references:MaHocKy"`
	SinhVienDiemRenLuyen []SinhVienDiemRenLuyen `gorm:"foreignKey:MaHocKyThamChieu;references:MaHocKy"`
}

func (HocKy) TableName() string {
	return "HocKy"
}
