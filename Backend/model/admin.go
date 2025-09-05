package model

type Admin struct {
	MaAdmin     string `json:"ma_admin" gorm:"primaryKey"`
	MaGiangVien string `json:"ma_giang_vien"`
}
