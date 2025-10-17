package giangvien

import (
	"Backend/initialize"
	"Backend/model"
	"time"

	"github.com/gin-gonic/gin"
)

func XemTatCaGiangVien(c *gin.Context) {
	type Giangvienoutput struct {
		MaGiangVien string    `json:"ma_giang_vien"`
		HoDem       string    `json:"ho_dem"`
		Ten         string    `json:"ten"`
		GioiTinh    bool      `json:"gioi_tinh"`
		NgaySinh    time.Time `json:"ngay_sinh"`
		QuocTich    string    `json:"quoc_tich"`
		MatKhau     string    `json:"mat_khau"`
	}

	var giangviens []Giangvienoutput

	result := initialize.DB.Model(model.GiangVien{}).Find(&giangviens)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Fail to get giangviens",
		})
		return
	}

	c.JSON(200, gin.H{
		"data": giangviens,
	})
}
