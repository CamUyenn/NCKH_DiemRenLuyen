package model

import "time"

type BangDiem struct {
	MaBangDiem string    `json:"ma_bang_diem" gorm:"primaryKey"`
	MaHocky    string    `json:"ma_hoc_ky"`
	NgayTao    time.Time `json:"ngay_tao"`
	TongDiem   int       `json:"tong_diem"`
	ThoiHanNop time.Time `json:"thoi_han_hop"`
}
