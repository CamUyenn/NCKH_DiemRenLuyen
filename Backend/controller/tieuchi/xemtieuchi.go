package tieuchi

import (
	"Backend/initialize"
	"Backend/model"

	"github.com/gin-gonic/gin"
)

func XemTieuChi(c *gin.Context) {
	// Fetch input data from JSON
	type Mabangdiemcheck struct {
		MabangdiemcheckJSON string ` json:"ma_bang_diem"`
	}
	var mabangdiemcheck Mabangdiemcheck

	if err := c.ShouldBindJSON(&mabangdiemcheck); err != nil {
		c.JSON(400, gin.H{
			"error": "Fetch input from JSON failed",
		})
		return
	}

	// Retrieve tieuchi from database
	type BangDiemChiTietOutPut struct {
		MaTieuChi           string `json:"ma_tieu_chi"`
		MaBangDiemThamChieu string `json:"ma_bang_diem_tham_chieu"`
		TenTieuChi          string `json:"ten_tieu_chi"`
		MucDiem             int    `json:"muc_diem"`
		Muc                 string `json:"muc"`
		Diem                int    `json:"diem"`
		MoTaDiem            string `json:"mo_ta_diem"`
		MaTieuChiCha        string `json:"ma_tieu_chi_cha"`
		LoaiTieuChi         string `json:"loai_tieu_chi"`
		SoLan               int    `json:"so_lan"`
	}

	var tieuchi []BangDiemChiTietOutPut
	result := initialize.DB.Model(&model.BangDiemChiTiet{}).Where("ma_bang_diem_tham_chieu = ?", mabangdiemcheck.MabangdiemcheckJSON).Find(&tieuchi)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Fetch tieuchi from DataBase failed",
		})
		return
	}

	c.JSON(200, tieuchi)
}
