package model

type Khoa struct {
	MaKhoa       string `gorm:"size:256;primaryKey" json:"ma_khoa"`
	TenKhoa      string `json:"ten_khoa"`
	MaTruongKhoa string `gorm:"size:256" json:"ma_truong_khoa"`

	LopSinhHoatHocKy []LopSinhHoatHocKy `gorm:"foreignKey:MaKhoaThamChieu;references:MaKhoa"`
	LopSinhHoat      []LopSinhHoat      `gorm:"foreignKey:MaKhoaThamChieu;references:MaKhoa"`
}

func (Khoa) TableName() string {
	return "Khoa"
}
