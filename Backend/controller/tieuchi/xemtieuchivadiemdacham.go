package tieuchi

import (
	"Backend/initialize"
	"Backend/model"

	"github.com/gin-gonic/gin"
)

func XemTieuChiVaDiemDaCham(c *gin.Context) {
	// Create a struct to hold the sinhviendiemrenluyenchitietoutput
	type Sinhviendiemrenluyenchitietoutput struct {
		MaSinhVienDiemRenLuyenChiTiet string `json:"ma_sinh_vien_diem_ren_luyen_chi_tiet"`
		TenTieuChi                    string `json:"ten_tieu_chi"`
		MucDiem                       int    `json:"muc_diem"`
		Muc                           string `json:"muc"`
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

	// Get mabangdiemcham from URL
	masinhviendiemrenluyen := c.Param("mabangdiemcham")

	// Query listthongtintrave by masinhviendiemrenluyen
	var listthongtintrave []Sinhviendiemrenluyenchitietoutput
	result := initialize.DB.Model(model.SinhVienDiemRenLuyenChiTiet{}).Where("ma_sinh_vien_diem_ren_luyen_tham_chieu = ?", masinhviendiemrenluyen).Find(&listthongtintrave)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Query listthongtintrave failed",
		})
		return
	}

	c.JSON(200, gin.H{
		"danh_sach_tieu_chi": listthongtintrave,
	})
}
