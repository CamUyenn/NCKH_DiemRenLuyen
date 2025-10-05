package bangdiem

import (
	"Backend/initialize"
	"Backend/model"
	"Backend/service/hockyhethong"

	"github.com/gin-gonic/gin"
)

func TaoBangDiem(c *gin.Context) {
	var hockycheck model.HocKy
	var bangdiemcheck model.BangDiem

	// Fetch mahocky from JSON
	if err := c.ShouldBindJSON(&hockycheck); err != nil {
		c.JSON(400, gin.H{
			"error": "Fetch mahocky from JSON failed",
		})
		return
	}

	// Create HocKy
	hockyhethong.TaoHocKyHeThong(c, hockycheck.MaHocKy)

	// Create MaBangDiem
	bangdiemcheck.MaBangDiem = hockycheck.MaHocKy + "_BD"
	bangdiemcheck.MaHocKyThamChieu = hockycheck.MaHocKy

	// Create BangDiem
	result := initialize.DB.Create(&bangdiemcheck)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Create bangdiem failed",
		})
		return
	} else {
		c.JSON(200, gin.H{
			"message": "Create bangdiem successfully",
		})
		return
	}
}
