package bangdiem

import (
	"Backend/initialize"
	"Backend/model"
	"net/http"

	"github.com/gin-gonic/gin"
)

func XoaBangDiem(c *gin.Context) {
	mabangdiem := c.Param("id")
	result := initialize.DB.Delete(&model.BangDiemChiTiet{}, "ma_bang_diem_tham_chieu = ?", mabangdiem)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete tieuchi foresign key"})
		return
	}

	if mabangdiem == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID is required"})
		return
	}
	result = initialize.DB.Delete(&model.BangDiem{}, "ma_bang_diem = ?", mabangdiem)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete bangdiem"})
		return
	}
}
