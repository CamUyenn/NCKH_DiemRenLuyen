package lopsinhhoat

import (
	"Backend/controller/hocky"
	"Backend/initialize"
	"Backend/model"

	"github.com/gin-gonic/gin"
)

func TaoLopSinhHoat(c *gin.Context) {
	type Lopsinhhoatxuly struct {
		Mahockyinput     string
		Lopsinhhoatinput model.LopSinhHoat
	}
	var lopsinhhoatxuly Lopsinhhoatxuly

	// Request data lopsinhhoat from JSON
	if err := c.ShouldBindJSON(&lopsinhhoatxuly); err != nil {
		c.JSON(400, gin.H{
			"error": "Fail to request data lopsinhhoat from JSON",
		})
		return
	}

	//Check if hocky exists
	var count_hocky int64
	result := initialize.DB.Model(&model.HocKy{}).Where("ma_hoc_ky = ?", lopsinhhoatxuly.Mahockyinput).Count(&count_hocky)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Fail to count hocky in database",
		})
		return
	}

	if count_hocky == 0 {
		hocky.TaoHocKy(c, lopsinhhoatxuly.Mahockyinput)
	} else {
		//Check if lopsinhhoat already exists
		var count int64
		result = initialize.DB.Model(&model.LopSinhHoat{}).Where("ma_lop_sinh_hoat = ?", lopsinhhoatxuly.Lopsinhhoatinput.MaLopSinhHoat).Count(&count)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Fail to count lopsinhhoat in database",
			})
			return
		}

		if count == 0 {
			// Create new lopsinhhoat to database
			result = initialize.DB.Create(&lopsinhhoatxuly.Lopsinhhoatinput)
			if result.Error != nil {
				c.JSON(400, gin.H{
					"error": "Fail to create new lopsinhhoat to database",
				})
				return
			} else {
				c.JSON(200, gin.H{
					"message": "Create new lopsinhhoat to database successfully",
				})
			}

		} else {
			// Update lopsinhhoat in database
			result = initialize.DB.Model(&model.LopSinhHoat{}).Where("ma_lop_sinh_hoat = ?", lopsinhhoatxuly.Lopsinhhoatinput.MaLopSinhHoat).Updates(lopsinhhoatxuly.Lopsinhhoatinput)
			if result.Error != nil {
				c.JSON(400, gin.H{
					"error": "Fail to update lopsinhhoat in database",
				})
				return
			} else {
				c.JSON(200, gin.H{
					"message": "Update lopsinhhoat in database successfully",
				})
			}
		}
	}
}
