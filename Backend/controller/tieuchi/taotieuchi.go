package tieuchi

import (
	"Backend/initialize"
	"Backend/model"
	"strconv"

	"github.com/gin-gonic/gin"
)

type Input struct {
	Mabangdiemcheck string `json:"ma_bang_diem"`
	Tieuchi         []model.BangDiemChiTiet
}

func TaoTieuChi(c *gin.Context) {
	var input Input

	// Fetch input data from JSON
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{
			"error": "Fetch input from JSON failed",
		})
		return
	}

	// Generate matieuchi
	for i, inputxuly := range input.Tieuchi {
		input.Tieuchi[i].MaTieuChi = input.Mabangdiemcheck + "+" + strconv.Itoa(inputxuly.MucDiem) + "," + inputxuly.Muc
		input.Tieuchi[i].MaBangDiemThamChieu = input.Mabangdiemcheck
	}

	// Create new tieuchi
	result := initialize.DB.Create(&input.Tieuchi)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Fail to create tieuchi",
		})
		return
	} else {
		c.JSON(200, gin.H{
			"message": "Create tieuchi successful",
		})
	}
}
