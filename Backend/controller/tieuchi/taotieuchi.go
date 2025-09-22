package tieuchi

import (
	"Backend/initialize"
	"Backend/model"
	"strconv"

	"github.com/gin-gonic/gin"
)

type Input struct {
	Mabangdiemcheck string                `json:"ma_bang_diem"`
	Tieuchi         model.BangDiemChiTiet `json:"tieuchi"`
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

	// Check tieuchi is exist in database
	var count int64
	var tieuchicheck []model.BangDiemChiTiet
	result := initialize.DB.Model(&model.BangDiemChiTiet{}).Where("ma_bang_diem_tham_chieu = ?", input.Mabangdiemcheck).Count(&count)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Count tieuchi in database failed",
		})
		return
	}

	result = initialize.DB.Where("ma_bang_diem_tham_chieu = ?", input.Mabangdiemcheck).Find(&tieuchicheck)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Fetch tieuchi from DataBase failed",
		})
		return
	}

	// Generate matieuchi
	input.Tieuchi.MaTieuChi = input.Mabangdiemcheck + "+" + strconv.Itoa(input.Tieuchi.MucDiem) + ":" + input.Tieuchi.Muc

	flash := 0
	for _, TieuChiCheck := range tieuchicheck {
		// If TieuChi already exists in database, update data
		if TieuChiCheck.MaTieuChi == input.Tieuchi.MaTieuChi {
			result = initialize.DB.Model(&model.BangDiemChiTiet{}).Where("ma_tieu_chi = ?", input.Tieuchi.MaTieuChi).Updates(input.Tieuchi)
			if result.Error != nil {
				c.JSON(400, gin.H{
					"error": "Update tieuchi failed",
				})
				return
			}
			flash = 1
			break
		}
	}

	// If TieuChi does not exist in database, create tieuchi
	if flash == 0 {
		input.Tieuchi.MaBangDiemThamChieu = input.Mabangdiemcheck
		result = initialize.DB.Create(&input.Tieuchi)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Create tieuchi failed",
			})
			return
		}
	}
}
