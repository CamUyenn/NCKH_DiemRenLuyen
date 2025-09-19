package hocky

import (
	"Backend/initialize"
	"Backend/model"
	"net/http"

	"github.com/gin-gonic/gin"
)

func XoaHocKy(c *gin.Context) {
	mahocky := c.Param("id")

	result := initialize.DB.Delete(&model.BangDiemChiTiet{}, "ma_bang_diem_tham_chieu LIKE ?", "%"+mahocky+"%")
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete tieuchi foresign key"})
		return
	}

	result = initialize.DB.Delete(&model.BangDiem{}, "ma_hoc_ky_tham_chieu = ?", mahocky)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete bangdiem foresign key"})
		return
	}

	if mahocky == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID is required"})
		return
	}
	result = initialize.DB.Delete(&model.HocKy{}, "ma_hoc_ky = ?", mahocky)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete hocky"})
		return
	}
}
