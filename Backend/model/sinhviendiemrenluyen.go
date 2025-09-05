package model

type SinhVienDiemRenLuyen struct {
	MaSinhVienDiemRenLuyen        string `json:"ma_sinh_vien_diem_ren_luyen" gorm:"primaryKey"`
	MaSinhVien                    string `json:"ma_sinh_vien"`
	MaBangDiem                    string `json:"ma_bang_diem"`
	MaHocKy                       string `json:"ma_hoc_ky"`
	TrangThai                     string `json:"trang_thai"`
	TongDiem                      int    `json:"tong_diem"`
	MaSinhVienDiemRenLuyenChiTiet string `json:"ma_sinh_vien_diem_ren_luyen_chi_tiet"`
}
