package giangvien

import (
	"Backend/initialize"
	"Backend/model"

	"github.com/gin-gonic/gin"
)

func TaoGiangVien(c *gin.Context) {
	var input model.GiangVien

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{
			"error": "Fetch input from JSON failed",
		})
		return
	}

	result := initialize.DB.Create(&input)
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
