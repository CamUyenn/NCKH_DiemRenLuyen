package sinhvien

import (
	"Backend/initialize"
	"Backend/model"

	"github.com/gin-gonic/gin"
)

func SuaSinhVien(c *gin.Context) {
	var input model.SinhVien

	// Fetch input data from JSON
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{
			"error": "Fetch input from JSON failed",
		})
		return
	}

	// Update sinhvien (theo ma_sinh_vien)
	result := initialize.DB.Model(&model.SinhVien{}).Where("ma_sinh_vien = ?", input.MaSinhVien).Updates(input)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Fail to update sinhvien",
		})
		return
	}

	c.JSON(200, gin.H{
		"message": "Update sinhvien successful",
	})
}
