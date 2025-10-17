package bangdiem

import (
	"Backend/initialize"
	"Backend/model"

	"github.com/gin-gonic/gin"
)

func XemDanhSachBangDiemSinhVienTheoLop(c *gin.Context) {
	// Inputs from URL
	makhoa := c.Param("makhoa")
	mahocky := c.Param("mahocky")

	// Output structure
	type classResult struct {
		MaLopSinhHoat         string `json:"ma_lop_sinh_hoat"`
		TenLop                string `json:"ten_lop"`
		MaHocKy               string `json:"ma_hoc_ky"`
		SoLuongSinhVien       int64  `json:"so_luong_sinh_vien"`
		SoLuongBangDiemDaCham int64  `json:"so_luong_bang_diem_da_cham"`
	}

	// Query data lopsinhhoat by makhoa and mahocky
	var classes []struct {
		MaLopSinhHoat string `gorm:"column:ma_lop_sinh_hoat"`
		TenLop        string `gorm:"column:ten_lop"`
	}
	result := initialize.DB.Model(&model.LopSinhHoat{}).
		Joins("JOIN LopSinhHoatHocKy ON LopSinhHoat.ma_lop_sinh_hoat = LopSinhHoatHocKy.ma_lop_sinh_hoat_tham_chieu").
		Where("LopSinhHoat.ma_khoa = ? AND LopSinhHoatHocKy.ma_hoc_ky_tham_chieu = ?", makhoa, mahocky).
		Select("LopSinhHoat.ma_lop_sinh_hoat, LopSinhHoat.ten_lop").
		Find(&classes)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Query classes failed",
		})
		return
	}

	//
	var class_results []classResult

	for _, class_item := range classes {
		// Get masinhvien by malopsinhhoat and mahocky
		var student_ids []string
		result = initialize.DB.Model(&model.LopSinhHoatSinhVien{}).
			Where("ma_lop_sinh_hoat_tham_chieu = ? AND ma_hoc_ky_tham_chieu = ?", class_item.MaLopSinhHoat, mahocky).
			Pluck("ma_sinh_vien_tham_chieu", &student_ids)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Query students failed",
			})
			return
		}

		// Count sinhvien in lopsinhhoat
		so_luong_sinh_vien := int64(len(student_ids))

		// Count sinhvien diemrenluyen already
		var so_luong_bang_diem_da_cham int64
		if so_luong_sinh_vien > 0 {
			result = initialize.DB.Model(&model.SinhVienDiemRenLuyen{}).
				Where("ma_hoc_ky_tham_chieu = ? AND trang_thai = ? AND ma_sinh_vien_tham_chieu IN ?", mahocky, "Giảng Viên Đã Chấm", student_ids).
				Count(&so_luong_bang_diem_da_cham)
			if result.Error != nil {
				c.JSON(400, gin.H{
					"error": "Count student score sheets failed",
				})
				return
			}
		} else {
			so_luong_bang_diem_da_cham = 0
		}

		// Append output data
		class_results = append(class_results, classResult{
			MaLopSinhHoat:         class_item.MaLopSinhHoat,
			TenLop:                class_item.TenLop,
			MaHocKy:               mahocky,
			SoLuongSinhVien:       so_luong_sinh_vien,
			SoLuongBangDiemDaCham: so_luong_bang_diem_da_cham,
		})
	}

	c.JSON(200, gin.H{
		"danh_sach_theo_lop": class_results,
	})
}
