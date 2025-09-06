package model

import "time"

type SinhVien struct {
	MaSinhVien string    `json:"ma_sinh_vien" gorm:"primaryKey"`
	HoDem      string    `json:"ho_dem"`
	Ten        string    `json:"ten"`
	GioiTinh   bool      `json:"gioi_tinh"`
	NgaySinh   time.Time `json:"ngay_sinh"`
	NoiSinh    string    `json:"noi_sinh"`
	MatKhau    string    `json:"mat_khau"`
}

func (SinhVien) TableName() string {
	return "SinhVien"
}
