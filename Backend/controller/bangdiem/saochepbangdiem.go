package bangdiem

import (
	"Backend/initialize"
	"Backend/model"
	"Backend/service/bangdiemhethong"
	"strings"

	"github.com/gin-gonic/gin"
)

func SaoChepBangDiem(c *gin.Context) {
	// Fetch mabangdiem and mahocky from JSON
	type DataInput struct {
		Mabangdiem string `json:"ma_bang_diem_sao_chep"`
		Mahocky    string `json:"ma_hoc_ky_moi"`
	}

	var datainput DataInput

	if err := c.ShouldBindJSON(&datainput); err != nil {
		c.JSON(400, gin.H{
			"error": "Fetch mabangdiem and mahocky from JSON failed",
		})
		return
	}

	// Query tieuchi in database by mabangdiem
	var danhsachtieuchi []model.BangDiemChiTiet

	result := initialize.DB.Where("ma_bang_diem_tham_chieu = ?", datainput.Mabangdiem).Find(&danhsachtieuchi)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Query tieuchi in database failed",
		})
		return
	}

	// Create new bangdiem
	resultString := bangdiemhethong.TaoBangDiemHeThong(datainput.Mahocky)
	if resultString != "Create bangdiem successful" {
		c.JSON(400, gin.H{
			"error": "Tao bangdiemhethong failed: " + resultString,
		})
		return
	}

	// Update matieuchi and mabangdiemthamchieu of danhsachtieuchi
	mabangdiemupdate := datainput.Mahocky + "_BD"

	for i, tieuchixuly := range danhsachtieuchi {
		danhsachtieuchi[i].MaBangDiemThamChieu = mabangdiemupdate
		hockysplit := strings.Split(tieuchixuly.MaTieuChi, "_")
		danhsachtieuchi[i].MaTieuChi = datainput.Mahocky + "_" + hockysplit[1]
		if tieuchixuly.MaTieuChiCha == "" {
			continue
		} else {
			danhsachtieuchi[i].MaTieuChiCha = datainput.Mahocky + "_" + strings.Split(tieuchixuly.MaTieuChiCha, "_")[1]
		}
	}

	// Create new tieuchisaochep in database
	result = initialize.DB.Create(&danhsachtieuchi)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Create new tieuchisaochep failed",
		})
		return
	} else {
		c.JSON(200, gin.H{
			"message": "Create new tieuchisaochep successful",
		})
		return
	}
}
