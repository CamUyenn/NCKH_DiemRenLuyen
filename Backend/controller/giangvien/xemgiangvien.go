package giangvien

import (
	"Backend/initialize"
	"Backend/model"
	"time"

	"github.com/gin-gonic/gin"
)

func XemGiangVien(c *gin.Context) {
	ma := c.Param("magiangvien")

	type Giangvienoutput struct {
		MaGiangVien string    `json:"ma_giang_vien"`
		HoDem       string    `json:"ho_dem"`
		Ten         string    `json:"ten"`
		GioiTinh    bool      `json:"gioi_tinh"`
		NgaySinh    time.Time `json:"ngay_sinh"`
		QuocTich    string    `json:"quoc_tich"`
		MatKhau     string    `json:"mat_khau"`
	}

	var giangvien Giangvienoutput

	result := initialize.DB.Model(model.GiangVien{}).First(&giangvien, "ma_giang_vien = ?", ma)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Fail to find giangvien",
		})
		return
	}

	c.JSON(200, gin.H{
		"data": giangvien,
	})
}
