package model

type SinhVien struct {
	MaSinhVien string `gorm:"size:256;primaryKey" json:"ma_sinh_vien"`
	HoDem      string `json:"ho_dem"`
	Ten        string `json:"ten"`
	GioiTinh   bool   `json:"gioi_tinh"`
	NgaySinh   string `json:"ngay_sinh"`
	NoiSinh    string `json:"noi_sinh"`
	MatKhau    string `json:"mat_khau"`

	LopSinhHoatHocKy    LopSinhHoatHocKy      `gorm:"foreignKey:MaLopTruong;references:MaSinhVien"`
	LopSinhHoatSinhVien []LopSinhHoatSinhVien `gorm:"foreignKey:MaSinhVienThamChieu;references:MaSinhVien"`
}

func (SinhVien) TableName() string {
	return "SinhVien"
}
