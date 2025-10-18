package lopsinhhoat

import (
	"Backend/initialize"
	"Backend/model"

	"github.com/gin-gonic/gin"
)

func TaoLopSinhHoatSinhVien(c *gin.Context) {
	// Bind JSON input
	type LopSinhHoatSinhVienRequest struct {
		MaHocKyThamChieu       string   `json:"ma_hoc_ky_tham_chieu" binding:"required"`
		MaLopSinhHoatThamChieu string   `json:"ma_lop_sinh_hoat_tham_chieu" binding:"required"`
		DanhSachMaSinhVien     []string `json:"danh_sach_ma_sinh_vien" binding:"required,min=1"`
	}

	var req LopSinhHoatSinhVienRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{
			"error": "Invalid input data",
		})
		return
	}

	var lophkSvRecords []model.LopSinhHoatSinhVien
	maHocKy := req.MaHocKyThamChieu
	maLopSH := req.MaLopSinhHoatThamChieu

	// Create LopSinhHoatSinhVien records for each MaSinhVien
	for _, maSV := range req.DanhSachMaSinhVien {

		// Generate MaLopSinhHoatSinhVien
		maLopSv := maHocKy + "+" + maLopSH + "~" + maSV

		lophkSv := model.LopSinhHoatSinhVien{
			MaLopSinhHoatSinhVien:  maLopSv,
			MaSinhVienThamChieu:    maSV,
			MaLopSinhHoatThamChieu: maLopSH,
			MaHocKyThamChieu:       maHocKy,
		}
		lophkSvRecords = append(lophkSvRecords, lophkSv)
	}

	result := initialize.DB.Create(&lophkSvRecords)
	if result.Error != nil {
		c.JSON(500, gin.H{
			"error": "Failed to save LopSinhHoatSinhVien data",
		})
		return
	}

	c.JSON(200, gin.H{
		"message": "Create LopSinhHoatSinhVien successful",
	})
}
