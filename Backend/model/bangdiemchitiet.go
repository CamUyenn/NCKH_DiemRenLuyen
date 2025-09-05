package model

type BangDiemChiTiet struct {
	MaTieuChi    string `json:"ma_tieu_chi" gorm:"primaryKey"`
	MaBangDiem   string `json:"ma_bang_diem"`
	TenTieuChi   string `json:"ten_tieu_chi"`
	Muc          int    `json:"muc"`
	Diem         int    `json:"diem"`
	MoTaDiem     string `json:"mo_ta_diem"`
	MaTieuChiCha string `json:"ma_tieu_chi_cha"`
	LoaiTieuChi  string `json:"loai_tieu_chi"`
	SoLan        int    `json:"so_lan"`
}
