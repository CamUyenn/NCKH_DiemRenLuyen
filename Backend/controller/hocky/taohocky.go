package hocky

import (
	"Backend/initialize"
	"Backend/model"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func TaoHocKy(c *gin.Context, mahocky string) {
	var hockycheck model.HocKy

	result := initialize.DB.Where("ma_hoc_ky = ?", mahocky).First(&hockycheck)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			slice := strings.Split(mahocky, ".")

			// Create new HocKy
			var err error
			hockycheck.MaHocKy = mahocky

			hockycheck.HocKy, err = strconv.Atoi(slice[1])
			if err != nil {
				c.JSON(400, gin.H{
					"error": "Loi chyen doi dang so nguyen",
				})
				return
			}

			hockycheck.NamHoc = slice[0]

			result = initialize.DB.Create(&hockycheck)
			if result.Error != nil {
				c.JSON(400, gin.H{
					"error": "Tao hoc ky khong thanh cong",
				})
				return
			}
			return
		} else {
			c.JSON(400, gin.H{
				"error": "Loi database",
			})
			return
		}
	} else {
		return
	}
}
