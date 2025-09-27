package bangdiemcham

import (
	"Backend/initialize"
	"Backend/model"

	"strings"

	"github.com/gin-gonic/gin"
)

func TaoBangDiemCham(c *gin.Context, mabangdiem string) {
	// Retrieve all sinhvien
	type SinhVienXuLy struct {
		MaSinhVien string `json:"ma_sinh_vien"`
	}

	var Sinhvienxulylist []SinhVienXuLy
	result := initialize.DB.Model(&model.SinhVien{}).Find(&Sinhvienxulylist)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Failed to retrieve sinhvien",
		})
		return
	}

	// Count sinhvien
	var count int64
	result = initialize.DB.Model(&model.SinhVien{}).Count(&count)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Failed to count sinhvien",
		})
		return
	}

	// Retrive bangdiem
	var bangdiem model.BangDiem
	result = initialize.DB.Where("ma_bang_diem = ?", mabangdiem).First(&bangdiem)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Failed to retrieve bangdiem",
		})
		return
	}

	// Create masinhviendiemrenluyen
	sinhviendiemrenluyenlist := make([]model.SinhVienDiemRenLuyen, count)
	run := 0
	for _, sinhviens := range Sinhvienxulylist {
		sinhviendiemrenluyenlist[run].MaSinhVienDiemRenLuyen = mabangdiem + "#" + sinhviens.MaSinhVien
		sinhviendiemrenluyenlist[run].MaBangDiemThamChieu = mabangdiem
		sinhviendiemrenluyenlist[run].MaSinhVienThamChieu = sinhviens.MaSinhVien
		hocky := strings.Split(mabangdiem, "_")
		sinhviendiemrenluyenlist[run].MaHocKyThamChieu = hocky[0]
		sinhviendiemrenluyenlist[run].TrangThai = "Chưa nộp"
		sinhviendiemrenluyenlist[run].TongDiem = bangdiem.TongDiem

		run++
	}

	// Create sinhviendiemrenluyen in database
	result = initialize.DB.Create(&sinhviendiemrenluyenlist)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Failed to create sinhviendiemrenluyenlist",
		})
		return
	}
}
