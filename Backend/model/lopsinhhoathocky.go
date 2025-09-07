package model

type LopSinhHoatHocKy struct {
	MaLopSinhHoatHocKy string `json:"ma_lop_sinh_hoat_hoc_ky" gorm:"primaryKey"`
	MaHocKy            string `json:"ma_hoc_ky"`
	MaLopSinhHoat      string `json:"ma_lop_sinh_hoat"`
	MaLopTruong        string `json:"ma_lop_truong"`
	MaGiangVienCoVan   string `json:"ma_giang_vien_co_van"`
	MaTruongKhoa       string `json:"ma_truong_khoa"`
	MaChuyenVienDaoTao string `json:"ma_chuyen_vien_dao_tao"`
	TongDiem           int    `json:"tong_diem"`
}
