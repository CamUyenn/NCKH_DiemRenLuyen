package hocky

import (
	"Backend/initialize"
	"Backend/model"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

func TaoHocKy(c *gin.Context, mahockyinput string) {
	var hockycheck model.HocKy
	hockycheck.MaHocKy = mahockyinput

	// Check if HocKy already exists
	var count int64
	result := initialize.DB.Model(&model.HocKy{}).Where("ma_hoc_ky = ?", mahockyinput).Count(&count)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Count hocky in database failed",
		})
		return
	}

	if count != 0 {
		c.JSON(200, gin.H{
			"error": "Hocky already exists",
		})
	} else {
		// Check the format of mahocky
		if !strings.Contains(mahockyinput, ".") || len(mahockyinput) != 11 {
			c.JSON(400, gin.H{
				"error": "Invalid mahocky format",
			})
			return
		} else {
			// Create new hocky
			slice := strings.Split(mahockyinput, ".")

			// Check the format of namhoc
			if !strings.Contains(slice[0], "-") || len(slice[0]) != 9 {
				c.JSON(400, gin.H{
					"error": "Invalid namhoc format",
				})
				return
			} else {
				hockycheck.NamHoc = slice[0]
				// Convert hocky to integer
				var err error
				hockycheck.HocKy, err = strconv.Atoi(slice[1])
				if err != nil {
					c.JSON(400, gin.H{
						"error": "Failed to convert to integer",
					})
					return
				}
				// Save hocky to database
				result = initialize.DB.Create(&hockycheck)
				if result.Error != nil {
					c.JSON(400, gin.H{
						"error": "Create hocky failed",
					})
					return
				} else {
					c.JSON(200, gin.H{
						"message": "Create hocky successfully",
					})
				}
			}
		}
	}
}
