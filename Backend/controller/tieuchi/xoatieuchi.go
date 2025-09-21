package tieuchi

import (
	"Backend/initialize"
	"Backend/model"
	"net/http"

	"github.com/gin-gonic/gin"
)

func XoaTieuChi(c *gin.Context) {
	matieuchi := c.Param("id")
	if matieuchi == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID is required"})
		return
	}
	result := initialize.DB.Delete(&model.BangDiemChiTiet{}, "ma_tieu_chi = ?", matieuchi)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete tieuchi"})
		return
	}
}
