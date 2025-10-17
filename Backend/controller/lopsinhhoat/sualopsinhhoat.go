package lopsinhhoat

import (
	"Backend/initialize"
	"Backend/model"

	"github.com/gin-gonic/gin"
)

func SuaLopSinhHoat(c *gin.Context) {
	var input model.LopSinhHoat

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{
			"error": "fetch input from json failed",
		})
		return
	}

	result := initialize.DB.Model(&model.LopSinhHoat{}).
		Where("ma_lop_sinh_hoat = ?", input.MaLopSinhHoat).
		Updates(input)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "fail to update lopsinhhoat",
		})
		return
	}

	c.JSON(200, gin.H{
		"message": "update lopsinhhoat successful",
	})
}
