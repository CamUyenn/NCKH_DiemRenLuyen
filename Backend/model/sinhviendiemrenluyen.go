package model

type SinhVienDiemRenLuyen struct {
	MaSinhVienDiemRenLuyen string `gorm:"size:256;primaryKey" json:"ma_sinh_vien_diem_ren_luyen"`
	MaSinhVienThamChieu    string `gorm:"size:256" json:"ma_sinh_vien_tham_chieu"`
	MaBangDiemThamChieu    string `gorm:"size:256" json:"ma_bang_diem_tham_chieu"`
	MaHocKyThamChieu       string `gorm:"size:256" json:"ma_hoc_ky_tham_chieu"`
	TrangThai              string `json:"trang_thai"`
	TongDiem               int    `json:"tong_diem"`

	SinhVien                    SinhVien                      `gorm:"foreignKey:MaSinhVienThamChieu;references:MaSinhVien"`
	SinhVienDiemRenLuyenChiTiet []SinhVienDiemRenLuyenChiTiet `gorm:"foreignKey:MaSinhVienDiemRenLuyenThamChieu;references:MaSinhVienDiemRenLuyen"`
	HocKy                       HocKy                         `gorm:"foreignKey:MaHocKyThamChieu;references:MaHocKy"`
}

func (SinhVienDiemRenLuyen) TableName() string {
	return "SinhVienDiemRenLuyen"
}
