package lopsinhhoat

import (
	"Backend/initialize"
	"Backend/model"

	"github.com/gin-gonic/gin"
)

func TaoLopSinhHoatHocKy(c *gin.Context) {

	type LopSinhHoatHocKyRequest struct {
		MaHocKyThamChieu string `json:"ma_hoc_ky_tham_chieu"`
		ChiTietLop       []struct {
			MaLopSinhHoatThamChieu string `json:"ma_lop_sinh_hoat_tham_chieu"`
			MaLopTruong            string `json:"ma_lop_truong"`
			MaGiangVienCoVan       string `json:"ma_giang_vien_co_van"`
			MaTruongKhoa           string `json:"ma_truong_khoa"`
			MaChuyenVienDaoTao     string `json:"ma_chuyen_vien_dao_tao"`
		} `json:"chi_tiet_lop"`
	}

	var req LopSinhHoatHocKyRequest

	// Bind JSON input
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{
			"error":   "Invalid input data",
			"details": err.Error(),
		})
		return
	}

	// Create LopSinhHoatHocKy records
	var lophkRecords []model.LopSinhHoatHocKy
	maHocKy := req.MaHocKyThamChieu

	for _, chitiet := range req.ChiTietLop {
		// Generate MaLopSinhHoatHocKy by combining MaHocKy and MaLopSinhHoatThamChieu
		maLopHK := maHocKy + "+" + chitiet.MaLopSinhHoatThamChieu

		lophk := model.LopSinhHoatHocKy{
			MaLopSinhHoatHocKy:     maLopHK,
			MaHocKyThamChieu:       maHocKy,
			MaLopSinhHoatThamChieu: chitiet.MaLopSinhHoatThamChieu,
			MaLopTruong:            chitiet.MaLopTruong,
			MaGiangVienCoVan:       chitiet.MaGiangVienCoVan,
			MaTruongKhoa:           chitiet.MaTruongKhoa,
			MaChuyenVienDaoTao:     chitiet.MaChuyenVienDaoTao,
		}
		lophkRecords = append(lophkRecords, lophk)
	}

	result := initialize.DB.Create(&lophkRecords)

	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Failed to save LopSinhHoatHocKy data",
		})
		return
	}

	c.JSON(200, gin.H{
		"message": "Create LopSinhHoatHocKy successful",
	})
}
