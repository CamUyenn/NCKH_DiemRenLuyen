package model

type SinhVienDiemRenLuyen struct {
	MaSinhVienDiemRenLuyen   string `gorm:"size:256;primaryKey" json:"ma_sinh_vien_diem_ren_luyen"`
	MaSinhVienThamChieu      string `gorm:"size:256" json:"ma_sinh_vien_tham_chieu"`
	MaBangDiemThamChieu      string `gorm:"size:256" json:"ma_bang_diem_tham_chieu"`
	MaHocKyThamChieu         string `gorm:"size:256" json:"ma_hoc_ky_tham_chieu"`
	TrangThai                string `json:"trang_thai"`
	XepLoaiSinhVien          string `json:"xep_loai_sinh_vien"`
	TongDiemSinhVien         int    `json:"tong_diem_sinh_vien"`
	XepLoaiLopTruong         string `json:"xep_loai_lop_truong"`
	TongDiemLopTruong        int    `json:"tong_diem_lop_truong"`
	XepLoaiCoVan             string `json:"xep_loai_co_van"`
	TongDiemCoVan            int    `json:"tong_diem_co_van"`
	XepLoaiTruongKhoa        string `json:"xep_loai_truong_khoa"`
	TongDiemTruongKhoa       int    `json:"tong_diem_truong_khoa"`
	XepLoaiChuyenVienDaoTao  string `json:"xep_loai_chuyen_vien_dao_tao"`
	TongDiemChuyenVienDaoTao int    `json:"tong_diem_chuyen_vien_dao_tao"`

	SinhVien                    SinhVien                      `gorm:"foreignKey:MaSinhVienThamChieu;references:MaSinhVien"`
	SinhVienDiemRenLuyenChiTiet []SinhVienDiemRenLuyenChiTiet `gorm:"foreignKey:MaSinhVienDiemRenLuyenThamChieu;references:MaSinhVienDiemRenLuyen"`
	HocKy                       HocKy                         `gorm:"foreignKey:MaHocKyThamChieu;references:MaHocKy"`
}

func (SinhVienDiemRenLuyen) TableName() string {
	return "SinhVienDiemRenLuyen"
}
