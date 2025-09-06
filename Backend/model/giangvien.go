package model

import "time"

type GiangVien struct {
	Ma_GV    string    `json:"ma_giang_vien" gorm:"primaryKey"`
	HoDem    string    `json:"ho_dem"`
	Ten      string    `json:"ten"`
	GioiTinh bool      `json:"gioi_tinh"`
	NgaySinh time.Time `json:"ngay_sinh"`
	QuocTich string    `json:"quoc_tich"`
	MatKhau  string    `json:"mat_khau"`
}

func (GiangVien) TableName() string {
	return "GiangVien"
}
