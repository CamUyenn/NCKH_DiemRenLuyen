package model

type SinhVienDiemRenLuyenChiTiet struct {
	MaSinhVienDiemRenLuyenChiTiet string `json:"ma_sinh_vien_diem_ren_luyen_chi_tiet" gorm:"primaryKey"`
	MaSinhVien                    string `json:"ma_sinh_vien"`
	MaBangDiem                    string `json:"ma_bang_diem"`
	MaTieuChi                     string `json:"ma_tieu_chi"`
	TenTieuChi                    string `json:"ten_tieu_chi"`
	Muc                           int    `json:"muc"`
	Diem                          int    `json:"diem"`
	MoTaDiem                      string `json:"mo_ta_diem"`
	MaTieuChiCha                  string `json:"ma_tieu_chi_cha"`
	LoaiTieuChi                   string `json:"loai_tieu_chi"`
	SoLan                         int    `json:"so_lan"`
	DiemSinhVienDanhGia           int    `json:"diem_sinh_vien_danh_gia"`
	DiemLopTruongDanhGia          int    `json:"diem_lop_truong_danh_gia"`
	DiemGiangVienDanhGia          int    `json:"diem_giang_vien_danh_gia"`
	DiemTruongKhoaDanhGia         int    `json:"diem_truong_khoa_danh_gia"`
	DiemChuyenVienDaoTao          int    `json:"diem_chuyen_vien_dao_tao"`
	XepLoai                       string `json:"xep_loai"`
}
