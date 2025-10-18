package tieuchi

import (
	"Backend/initialize"
	"Backend/model"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

func SuaTieuChi(c *gin.Context) {
	// Fetch mabangdiem and danhsachtieuchi from JSON
	type Input struct {
		Mabangdiemcheck string `json:"ma_bang_diem_chinh_sua"`
		Tieuchi         []model.BangDiemChiTiet
	}

	var input Input

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{
			"error": "Fetch mabangdiem and danhsachtieuchi failed",
		})
		return
	}
	// Check trangthai bangdiem
	var bangdiem model.BangDiem
	result := initialize.DB.Where("ma_bang_diem = ?", input.Mabangdiemcheck).Find(&bangdiem)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Query bangdiem in database failed",
		})
		return
	}

	if bangdiem.TrangThai == "Chưa Phát" {
		// Delete danhsachtieuchi in database by mabangdiemthamchieu
		result = initialize.DB.Delete(&model.BangDiemChiTiet{}, "ma_bang_diem_tham_chieu = ?", input.Mabangdiemcheck)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Failed to delete danhsachtieuchi",
			})
			return
		}

		// Create new matieuchi
		for i, inputxuly := range input.Tieuchi {
			if inputxuly.MaTieuChiCha == "" {
				input.Tieuchi[i].MaTieuChi = input.Mabangdiemcheck + "+" + strconv.Itoa(inputxuly.MucDiem) + "," + inputxuly.Muc + "()"
				input.Tieuchi[i].MaBangDiemThamChieu = input.Mabangdiemcheck
				continue
			} else {
				machasplit := strings.Split(inputxuly.MaTieuChiCha, "(")
				macha := strings.Split(machasplit[0], "D")
				input.Tieuchi[i].MaTieuChi = input.Mabangdiemcheck + "+" + strconv.Itoa(inputxuly.MucDiem) + "," + inputxuly.Muc + "(" + macha[1] + ")"
				input.Tieuchi[i].MaBangDiemThamChieu = input.Mabangdiemcheck
			}
		}

		//Create new tieuchi
		result = initialize.DB.Create(input.Tieuchi)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Update tieuchi failed",
			})
			return
		} else {
			c.JSON(200, gin.H{
				"message": "Update tieuchi successful",
			})
		}
	} else {
		c.JSON(400, gin.H{
			"error": "Cannot modify tieuchi when bangdiem is Đã Phát",
		})
		return
	}
}
