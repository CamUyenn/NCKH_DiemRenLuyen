package hocky

import (
	"Backend/initialize"
	"Backend/model"

	"github.com/gin-gonic/gin"
)

func XemHocKy(c *gin.Context) {
	type HocKyOutPut struct {
		MaHocKy string `json:"ma_hoc_ky"`
		HocKy   int    `json:"hoc_ky"`
		NamHoc  string `json:"nam_hoc"`
	}

	var hocKy []HocKyOutPut
	result := initialize.DB.Model(&model.HocKy{}).Find(&hocKy)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Failed to retrieve hocky data",
		})
		return
	}
	c.JSON(200, hocKy)
}
