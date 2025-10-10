package hockyhethong

import (
	"Backend/initialize"
	"Backend/model"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

func TaoHocKyHeThong(c *gin.Context, mahocky string) {
	// Create hocky and namhoc values
	var hockyxuly model.HocKy

	slices := strings.Split(mahocky, ".")
	hockyxuly.NamHoc = slices[0]
	hockyInt, err := strconv.Atoi(slices[1])
	if err != nil {
		c.JSON(400, gin.H{
			"error": "Invalid HocKy format",
		})
		return
	}
	hockyxuly.HocKy = hockyInt
	hockyxuly.MaHocKy = mahocky

	// Create new hocky in database
	result := initialize.DB.Create(&hockyxuly)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Fail to create new hocky",
		})
		return
	} else {
		c.JSON(200, gin.H{
			"message": "Create new hocky successful",
		})
	}
}
