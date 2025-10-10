package bangdiem

import (
	"Backend/initialize"
	"Backend/model"
	"Backend/service/bangdiemhethong"
	"strconv"

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
	bangdiemhethong.TaoBangDiemHeThong(c, datainput.Mahocky)

	// Update matieuchi and mabangdiemthamchieu of danhsachtieuchi
	mabangdiemupdate := datainput.Mahocky + "_BD"

	for i, tieuchixuly := range danhsachtieuchi {
		danhsachtieuchi[i].MaBangDiemThamChieu = mabangdiemupdate
		danhsachtieuchi[i].MaTieuChi = mabangdiemupdate + "+" + strconv.Itoa(tieuchixuly.MucDiem) + "," + tieuchixuly.Muc
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
			"error": "Create new tieuchisaochep successful",
		})
		return
	}
}
