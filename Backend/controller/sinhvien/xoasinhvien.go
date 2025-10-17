package sinhvien

import (
	"Backend/initialize"
	"Backend/model"

	"github.com/gin-gonic/gin"
)

func XoaSinhVien(c *gin.Context) {
	ma := c.Param("masinhvien")

	result := initialize.DB.Delete(&model.SinhVien{}, "ma_sinh_vien = ?", ma)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Fail to delete sinhvien",
		})
		return
	}

	c.JSON(200, gin.H{
		"message": "Delete sinhvien successful",
	})
}
