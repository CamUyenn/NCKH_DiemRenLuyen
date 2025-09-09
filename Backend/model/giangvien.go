package model

import "time"

type GiangVien struct {
	MaGiangVien string    `gorm:"size:256;primaryKey" json:"ma_giang_vien"`
	HoDem       string    `json:"ho_dem"`
	Ten         string    `json:"ten"`
	GioiTinh    bool      `json:"gioi_tinh"`
	NgaySinh    time.Time `json:"ngay_sinh"`
	QuocTich    string    `json:"quoc_tich"`
	MatKhau     string    `json:"mat_khau"`

	Admin            Admin            `gorm:"foreignKey:MaGiangVienThamChieu;references:MaGiangVien"`
	LopSinhHoatHocKy LopSinhHoatHocKy `gorm:"foreignKey:MaGiangVienCoVan;references:MaGiangVien"`
}

func (GiangVien) TableName() string {
	return "GiangVien"
}
