package bangdiemhethong

import (
	"Backend/initialize"
	"Backend/model"
	"Backend/service/hockyhethong"
)

func TaoBangDiemHeThong(mahocky string) string {
	var bangdiemcheck model.BangDiem

	// Create HocKy và kiểm tra giá trị trả về
	returnString := hockyhethong.TaoHocKyHeThong(mahocky)
	if returnString != "Create hocky successful" {
		return "Tao hoc ky failed: " + returnString
	}

	// Create MaBangDiem
	bangdiemcheck.MaBangDiem = mahocky + "_BD"
	bangdiemcheck.MaHocKyThamChieu = mahocky
	bangdiemcheck.TrangThai = "Chưa Phát"

	// Create BangDiem
	result := initialize.DB.Create(&bangdiemcheck)
	if result.Error != nil {
		return "Create bangdiem failed"
	}
	return "Create bangdiem successful"
}
