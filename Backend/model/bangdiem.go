package model

import "time"

type BangDiem struct {
	MaBangDiem       string    `gorm:"size:256;primaryKey" json:"ma_bang_diem"`
	MaHocKyThamChieu string    `gorm:"size:256" json:"ma_hoc_ky_tham_chieu"`
	NgayTao          time.Time `json:"ngay_tao"`
	TongDiem         int       `json:"tong_diem"`
	ThoiHanNop       time.Time `json:"thoi_han_hop"`

	HocKy                HocKy                `gorm:"foreignKey:MaHocKyThamChieu;references:MaHocKy"`
	BangDiemChiTiet      []BangDiemChiTiet    `gorm:"foreignKey:MaBangDiemThamChieu;references:MaBangDiem"`
	SinhVienDiemRenLuyen SinhVienDiemRenLuyen `gorm:"foreignKey:MaBangDiemThamChieu;references:MaBangDiem"`
}

func (BangDiem) TableName() string {
	return "BangDiem"
}
