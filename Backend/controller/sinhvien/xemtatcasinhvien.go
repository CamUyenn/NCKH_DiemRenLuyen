package sinhvien

import (
	"Backend/initialize"
	"Backend/model"
	"time"

	"github.com/gin-gonic/gin"
)

func XemTatCaSinhVien(c *gin.Context) {
	type Sinhvienoutput struct {
		MaSinhVien string    `gorm:"size:256;primaryKey" json:"ma_sinh_vien"`
		HoDem      string    `json:"ho_dem"`
		Ten        string    `json:"ten"`
		GioiTinh   bool      `json:"gioi_tinh"`
		NgaySinh   time.Time `json:"ngay_sinh"`
		NoiSinh    string    `json:"noi_sinh"`
		MatKhau    string    `json:"mat_khau"`
	}

	var sinhviens []Sinhvienoutput

	result := initialize.DB.Model(model.SinhVien{}).Find(&sinhviens)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Fail to get sinhviens",
		})
		return
	}

	c.JSON(200, gin.H{
		"data": sinhviens,
	})
}
