package hocky

import (
	"Backend/initialize"
	"Backend/model"

	"github.com/gin-gonic/gin"
)

func XemDanhSachHocKy(c *gin.Context) {
	//Query manguoidung and type from URL
	manguoidung := c.Param("manguoidung")
	userType := c.Param("type")

	//Query list hocky
	switch userType {
	case "sinhvien", "loptruong":
		hockyoutput := []string{}
		result := initialize.DB.Model(model.LopSinhHoatSinhVien{}).Select("ma_hoc_ky_tham_chieu").Where("ma_sinh_vien_tham_chieu = ?", manguoidung).Find(&hockyoutput)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Query list hocky failed",
			})
			return
		}
		c.JSON(200, gin.H{
			"list_hocky": hockyoutput,
		})
		return
	case "giangvien", "truongkhoa", "chuyenviendaotao":
		hockyoutput := []model.HocKy{}
		result := initialize.DB.Select("ma_hoc_ky").Find(&hockyoutput)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Query list hocky failed",
			})
			return
		}
		c.JSON(200, gin.H{
			"list_hocky": hockyoutput,
		})
		return
	}
}
