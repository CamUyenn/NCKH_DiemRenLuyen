package giangvien

import (
	"Backend/initialize"
	"Backend/model"

	"github.com/gin-gonic/gin"
)

func SuaGiangVien(c *gin.Context) {
	var input model.GiangVien

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{
			"error": "Fetch input from JSON failed",
		})
		return
	}

	result := initialize.DB.Model(&model.GiangVien{}).
		Where("ma_giang_vien = ?", input.MaGiangVien).
		Updates(input)

	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Fail to update giangvien",
		})
		return
	}

	c.JSON(200, gin.H{
		"message": "Update giangvien successful",
	})
}
