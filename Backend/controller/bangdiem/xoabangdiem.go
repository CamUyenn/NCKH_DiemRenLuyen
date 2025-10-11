package bangdiem

import (
	"Backend/initialize"
	"Backend/model"

	"github.com/gin-gonic/gin"
)

func XoaBangDiem(c *gin.Context) {
	// Fetch mahocky from URL
	mabangdiem := c.Param("mabangdiem")

	// Delete tieuchi is mabangdiemthamchieu equal mabangdiem
	result := initialize.DB.Delete(&model.BangDiemChiTiet{}, "ma_bang_diem_tham_chieu = ?", mabangdiem)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Failed to delete tieuchi foresign key",
		})
		return
	}

	// Delete bangdiem
	result = initialize.DB.Delete(&model.BangDiem{}, "ma_bang_diem = ?", mabangdiem)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Failed to delete bangdiem",
		})
		return
	} else {
		c.JSON(200, gin.H{
			"message": "Delete bangdiem succesful",
		})
		return
	}
}
