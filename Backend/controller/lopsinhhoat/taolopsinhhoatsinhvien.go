package lopsinhhoat

import (
	"Backend/initialize"
	"Backend/model"

	"github.com/gin-gonic/gin"
)

func TaoLopSinhHoatSinhVien(c *gin.Context) {
	type LopSinhHoatSinhVienRequest struct {
		MaHocKyThamChieu       string   `json:"ma_hoc_ky_tham_chieu"`
		MaLopSinhHoatThamChieu string   `json:"ma_lop_sinh_hoat_tham_chieu"`
		DanhSachMaSinhVien     []string `json:"danh_sach_ma_sinh_vien"`
	}

	// Accept a slice instead of an object
	var req []LopSinhHoatSinhVienRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{
			"error": "Invalid input data",
		})
		return
	}

	var lophkSvRecords []model.LopSinhHoatSinhVien

	// Iterate through each element in the slice
	for _, item := range req {
		maHocKy := item.MaHocKyThamChieu
		maLopSH := item.MaLopSinhHoatThamChieu

		for _, maSV := range item.DanhSachMaSinhVien {
			maLopSv := maHocKy + "+" + maLopSH + "~" + maSV

			lophkSv := model.LopSinhHoatSinhVien{
				MaLopSinhHoatSinhVien:  maLopSv,
				MaSinhVienThamChieu:    maSV,
				MaLopSinhHoatThamChieu: maLopSH,
				MaHocKyThamChieu:       maHocKy,
			}

			lophkSvRecords = append(lophkSvRecords, lophkSv)
		}
	}

	// Save all records at once
	result := initialize.DB.Create(&lophkSvRecords)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Failed to save LopSinhHoatSinhVien data",
		})
		return
	}

	c.JSON(200, gin.H{
		"message": "Create LopSinhHoatSinhVien successful",
	})
}
