package tieuchi

import (
	"Backend/initialize"
	"Backend/model"
	"strconv"

	"github.com/gin-gonic/gin"
)

func SuaTieuChi(c *gin.Context) {
	// Fetch mabangdiem and danhsachtieuchi from JSON
	type DataInput struct {
		Mabangdiem      string `json:"ma_bang_diem_chinh_sua"`
		Danhsachtieuchi []model.BangDiemChiTiet
	}

	var datainput DataInput

	if err := c.ShouldBindJSON(&datainput); err != nil {
		c.JSON(400, gin.H{
			"error": "Fetch mabangdiem and danhsachtieuchi failed",
		})
		return
	}

	// Delete danhsachtieuchi in database by mabangdiemthamchieu
	result := initialize.DB.Delete(&model.BangDiemChiTiet{}, "ma_bang_diem_tham_chieu = ?", datainput.Mabangdiem)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Failed to delete danhsachtieuchi",
		})
		return
	}

	// Create new matieuchi
	for i, tieuchixuly := range datainput.Danhsachtieuchi {
		datainput.Danhsachtieuchi[i].MaBangDiemThamChieu = datainput.Mabangdiem
		datainput.Danhsachtieuchi[i].MaTieuChi = datainput.Mabangdiem + "+" + strconv.Itoa(tieuchixuly.MucDiem) + "," + tieuchixuly.Muc
	}

	//Create new tieuchi
	result = initialize.DB.Create(datainput.Danhsachtieuchi)
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
}
