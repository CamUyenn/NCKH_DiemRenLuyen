package model

type Admin struct {
	MaAdmin              string `gorm:"size:256;primaryKey" json:"ma_admin"`
	MaGiangVienThamChieu string `gorm:"size:256" json:"ma_giang_vien_tham_chieu"`
}

func (Admin) TableName() string {
	return "Admin"
}
