package hockyhethong

import (
	"Backend/initialize"
	"Backend/model"
	"strconv"
	"strings"
)

func TaoHocKyHeThong(mahocky string) string {
	// Create hocky and namhoc values
	var hockyxuly model.HocKy

	slices := strings.Split(mahocky, ".")
	if len(slices) != 2 {
		return "Invalid HocKy format"
	}
	hockyxuly.NamHoc = slices[0]
	hockyInt, err := strconv.Atoi(slices[1])
	if err != nil {
		return "Invalid HocKy format"
	}
	hockyxuly.HocKy = hockyInt
	hockyxuly.MaHocKy = mahocky

	// Create new hocky in database
	result := initialize.DB.Create(&hockyxuly)
	if result.Error != nil {
<<<<<<< HEAD
		c.JSON(400, gin.H{
			"error": "Fail to create new hocky",
		})
		return
	} else {
		return
=======
		return "Fail to create new hocky"
>>>>>>> 54db0cfe91283937b393f372ef7eba95da22e35f
	}
	return "Create hocky successful"
}
