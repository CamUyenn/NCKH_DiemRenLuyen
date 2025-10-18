package hocky

import (
	"Backend/initialize"
	"Backend/model"

	"github.com/gin-gonic/gin"
)

func XoaHocKy(c *gin.Context) {
	// Fetch mahocky from URL
	mahocky := c.Param("mahocky")

	// Delete tieuchi of bangdiem is mahockythamchieu equal mahocky
	result := initialize.DB.Delete(&model.BangDiemChiTiet{}, "ma_bang_diem_tham_chieu LIKE ?", "%"+mahocky+"%")
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Failed to delete tieuchi foresign key",
		})
		return
	}

	// Delete bangdiem is mahockythamchieu equal mahocky
	result = initialize.DB.Delete(&model.BangDiem{}, "ma_hoc_ky_tham_chieu = ?", mahocky)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Failed to delete bangdiem foresign key",
		})
		return
	}

	// Delete hocky
	result = initialize.DB.Delete(&model.HocKy{}, "ma_hoc_ky = ?", mahocky)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Failed to delete hocky",
		})
		return
	} else {
		c.JSON(200, gin.H{
			"message": "Delete hocky succesful",
		})
		return
	}
}
