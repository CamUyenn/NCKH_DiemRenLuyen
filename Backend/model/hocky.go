package model

type HocKy struct {
	MaHocKy string `json:"ma_hoc_ky" gorm:"primaryKey"`
	HocKy   int    `json:"hoc_ky"`
	NamHoc  string `json:"nam_hoc"`
}
