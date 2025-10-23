package bangdiem

import (
	"Backend/initialize"

	"github.com/gin-gonic/gin"
)

func XemTrangThaiBangDiem(c *gin.Context) {
	mabangdiemcheck := c.Param("mabangdiem")
	var trangthaioutput string

	// Query trangthai by mabangdiem
	result := initialize.DB.Select("trang_thai").Where("ma_bang_diem = ?", mabangdiemcheck).First(&trangthaioutput)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Query trangthai failed",
		})
		return
	}

	c.JSON(200, gin.H{
		"trang_thai": trangthaioutput,
	})
}
