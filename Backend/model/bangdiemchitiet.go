package model

type BangDiemChiTiet struct {
	MaTieuChi           string `gorm:"size:256;primaryKey" json:"ma_tieu_chi"`
	MaBangDiemThamChieu string `gorm:"size:256" json:"ma_bang_diem_tham_chieu"`
	TenTieuChi          string `json:"ten_tieu_chi"`
	MucDiem             int    `json:"muc_diem"`
	Muc                 string `json:"muc"`
	Diem                int    `json:"diem"`
	MoTaDiem            string `json:"mo_ta_diem"`
	MaTieuChiCha        string `gorm:"size:256" json:"ma_tieu_chi_cha"`
	LoaiTieuChi         string `json:"loai_tieu_chi"`
	SoLan               int    `json:"so_lan"`

	BangDiem                    BangDiem                    `gorm:"foreignKey:MaBangDiemThamChieu;references:MaBangDiem"`
	SinhVienDiemRenLuyenChiTiet SinhVienDiemRenLuyenChiTiet `gorm:"foreignKey:MaTieuChiThamChieu;references:MaTieuChi"`
}

func (BangDiemChiTiet) TableName() string {
	return "BangDiemChiTiet"
}
