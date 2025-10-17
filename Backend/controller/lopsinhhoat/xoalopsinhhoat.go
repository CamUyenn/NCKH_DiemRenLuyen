package lopsinhhoat

import (
	"Backend/initialize"
	"Backend/model"

	"github.com/gin-gonic/gin"
)

func XoaLopSinhHoat(c *gin.Context) {
	ma := c.Param("malopsinhhoat")

	result := initialize.DB.Delete(&model.LopSinhHoat{}, "ma_lop_sinh_hoat = ?", ma)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "fail to delete lopsinhhoat",
		})
		return
	}

	c.JSON(200, gin.H{
		"message": "delete lopsinhhoat successful",
	})
}
