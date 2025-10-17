package sinhvien

import (
	"Backend/initialize"
	"Backend/model"

	"github.com/gin-gonic/gin"
)

func TaoSinhVien(c *gin.Context) {
	var input model.SinhVien

	// Fetch input data from JSON
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{
			"error": "Fetch input from JSON failed",
		})
		return
	}

	// Create new sinhvien
	result := initialize.DB.Create(&input)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Fail to create sinhvien",
		})
		return
	} else {
		c.JSON(200, gin.H{
			"message": "Create sinhvien successful",
		})
	}
}
