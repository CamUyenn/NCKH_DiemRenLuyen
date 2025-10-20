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
		return "Fail to create new hocky"
	}
	return "Create hocky successful"
}
