package giangvien

import (
	"Backend/initialize"
	"Backend/model"

	"github.com/gin-gonic/gin"
)

func TaoGiangVien(c *gin.Context) {
	var inputs []model.GiangVien

	if err := c.ShouldBindJSON(&inputs); err != nil {
		c.JSON(400, gin.H{
			"error": "Fetch input from JSON failed",
		})
		return
	}

	result := initialize.DB.Create(&inputs)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Fail to create giangvien",
		})
		return
	}

	c.JSON(200, gin.H{
		"message": "Create giangvien successful",
	})
}
