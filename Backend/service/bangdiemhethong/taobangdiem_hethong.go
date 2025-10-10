package bangdiemhethong

import (
	"Backend/initialize"
	"Backend/model"
	"Backend/service/hockyhethong"

	"github.com/gin-gonic/gin"
)

func TaoBangDiemHeThong(c *gin.Context, mahocky string) {
	var bangdiemcheck model.BangDiem

	// Create HocKy
	hockyhethong.TaoHocKyHeThong(c, mahocky)

	// Create MaBangDiem
	bangdiemcheck.MaBangDiem = mahocky + "_BD"
	bangdiemcheck.MaHocKyThamChieu = mahocky

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
