package giangvien

import (
	"Backend/initialize"
	"Backend/model"

	"github.com/gin-gonic/gin"
)

func XoaGiangVien(c *gin.Context) {
	ma := c.Param("magiangvien")

	result := initialize.DB.Delete(&model.GiangVien{}, "ma_giang_vien = ?", ma)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Fail to delete giangvien",
		})
		return
	}

	c.JSON(200, gin.H{
		"message": "Delete giangvien successful",
	})
}
