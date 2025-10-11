package tieuchi

import (
	"Backend/initialize"
	"Backend/model"

	"github.com/gin-gonic/gin"
)

func XemTieuChi(c *gin.Context) {
	// Fetch input mabangdiem from URL
	mabangdiem := c.Param("mabangdiem")

	// Query tieuchi in the database by mabangdiem
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

	var danhsachtieuchi []BangDiemChiTietOutPut

	result := initialize.DB.Model(&model.BangDiemChiTiet{}).Where("ma_bang_diem_tham_chieu = ?", mabangdiem).Find(&danhsachtieuchi)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Query tieuchi from DataBase failed",
		})
		return
	}

	// Return danhsachtieuchi JSON for frontend
	c.JSON(200, danhsachtieuchi)
}
