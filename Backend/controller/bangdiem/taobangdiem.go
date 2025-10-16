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

	// Create HocKy và kiểm tra giá trị trả về
	returnString := hockyhethong.TaoHocKyHeThong(hockycheck.MaHocKy)
	if returnString != "Create hocky successful" {
		c.JSON(400, gin.H{
			"error": "Tao hocky failed: " + returnString,
		})
		return
	}

	// Create MaBangDiem
	bangdiemcheck.MaBangDiem = hockycheck.MaHocKy + "_BD"
	bangdiemcheck.MaHocKyThamChieu = hockycheck.MaHocKy
	bangdiemcheck.TrangThai = "Chưa Phát"

	// Create BangDiem
	result := initialize.DB.Create(&bangdiemcheck)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Create bangdiem failed",
		})
		return
	} else {
		c.JSON(200, gin.H{
			"message": "Create bangdiem successful",
		})
		return
	}
}
