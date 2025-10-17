package lopsinhhoat

import (
	"Backend/initialize"
	"Backend/model"

	"github.com/gin-gonic/gin"
)

func XemTatCaLopSinhHoat(c *gin.Context) {
	type lopsinhhoatoutput struct {
		MaLopSinhHoat string `json:"ma_lop_sinh_hoat"`
		TenLop        string `json:"ten_lop"`
		MaDonVi       string `json:"ma_don_vi"`
		DangHoatDong  int    `json:"dang_hoat_dong"`
		MaKhoa        string `json:"ma_khoa"`
		MaNganh       string `json:"ma_nganh"`
	}

	var lopsinhhoats []lopsinhhoatoutput

	result := initialize.DB.Model(model.LopSinhHoat{}).Find(&lopsinhhoats)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "fail to get lopsinhhoats",
		})
		return
	}

	c.JSON(200, gin.H{
		"data": lopsinhhoats,
	})
}
