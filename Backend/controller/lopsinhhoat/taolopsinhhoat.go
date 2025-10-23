package lopsinhhoat

import (
	"Backend/initialize"
	"Backend/model"

	"github.com/gin-gonic/gin"
)

func TaoLopSinhHoat(c *gin.Context) {
	var inputs []model.LopSinhHoat

	if err := c.ShouldBindJSON(&inputs); err != nil {
		c.JSON(400, gin.H{
			"error": "fetch input from json failed",
		})
		return
	}

	result := initialize.DB.Create(&inputs)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "fail to create lopsinhhoat",
		})
		return
	}

	c.JSON(200, gin.H{
		"message": "create lopsinhhoat successful",
	})
}
