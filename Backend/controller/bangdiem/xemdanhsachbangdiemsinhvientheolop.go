package bangdiem

import (
	"Backend/initialize"
	"Backend/model"

	"github.com/gin-gonic/gin"
)

func XemDanhSachBangDiemSinhVienTheoLop(c *gin.Context) {
	// Inputs from URL
	magiangvien := c.Param("magiangvien")
	mahocky := c.Param("mahocky")

	// Output structure
	type classResult struct {
		MaLopSinhHoat string `json:"ma_lop_sinh_hoat"`
		TenLop        string `json:"ten_lop"`
		TenGiangVien  string `json:"ten_giang_vien"`
		TrangThai     string `json:"trang_thai"`
	}

	// Get role by magiangvien
	var role string
	var count int64
	result := initialize.DB.Model(&model.LopSinhHoatHocKy{}).Where("ma_truong_khoa = ? AND ma_hoc_ky_tham_chieu = ?", magiangvien, mahocky).Count(&count)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Failed count query",
		})
		return
	}
	if count != 0 {
		role = "truongkhoa"
	} else {
		role = "giangvien"
	}

	// Check type
	if role == "truongkhoa" {
		// Get malop by matruongkhoa and mahocky
		var malop string
		result := initialize.DB.Model(&model.LopSinhHoatHocKy{}).Where("ma_truong_khoa = ? AND ma_hoc_ky_tham_chieu = ?", magiangvien, mahocky).Select("ma_lop_sinh_hoat_tham_chieu").First(&malop)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Get malop failed",
			})
			return
		}

		// Get makhoa by malop
		var makhoa string
		result = initialize.DB.Model(&model.LopSinhHoat{}).Where("ma_lop_sinh_hoat = ?", malop).Select("ma_khoa_tham_chieu").First(&makhoa)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Get makhoa failed",
			})
			return
		}
		// Query data lopsinhhoat by makhoa and mahocky
		var classes []struct {
			MaLopSinhHoat    string `gorm:"column:ma_lop_sinh_hoat"`
			TenLop           string `gorm:"column:ten_lop"`
			Magiangviencovan string `gorm:"column:ma_giang_vien_co_van"`
		}
		result = initialize.DB.Model(&model.LopSinhHoat{}).
			Joins("JOIN LopSinhHoatHocKy ON LopSinhHoat.ma_lop_sinh_hoat = LopSinhHoatHocKy.ma_lop_sinh_hoat_tham_chieu").
			Where("LopSinhHoat.ma_khoa_tham_chieu = ? AND LopSinhHoatHocKy.ma_hoc_ky_tham_chieu = ?", makhoa, mahocky).
			Select("LopSinhHoat.ma_lop_sinh_hoat, LopSinhHoat.ten_lop, LopSinhHoatHocKy.ma_giang_vien_co_van").
			Find(&classes)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Query classes failed",
			})
			return
		}

		var class_results []classResult

		for _, class_item := range classes {
			// Get tengiangvien by magiangviencovan
			type Tengiangvien struct {
				HoDem string `json:"ho_dem"`
				Ten   string `json:"ten"`
			}
			var tengiangvien Tengiangvien
			result = initialize.DB.Model(&model.GiangVien{}).Where("ma_giang_vien = ?", class_item.Magiangviencovan).Select("ho_dem", "ten").Find(&tengiangvien)
			if result.Error != nil {
				c.JSON(400, gin.H{
					"error": "Query tengiangvien failed",
				})
				return
			}

			// Get masinhvien by malopsinhhoat
			var danhsachsinhvien []string
			result = initialize.DB.Model(&model.LopSinhHoatSinhVien{}).Distinct("ma_sinh_vien_tham_chieu").Where("ma_lop_sinh_hoat_tham_chieu = ?", class_item.MaLopSinhHoat).Select("ma_sinh_vien_tham_chieu").Find(&danhsachsinhvien)
			if result.Error != nil {
				c.JSON(400, gin.H{
					"error": "Query danhsachsinhvien failed",
				})
				return
			}

			// Count trangthai bangdiem by sinhvien
			var count int64
			result = initialize.DB.Model(&model.SinhVienDiemRenLuyen{}).Where("ma_sinh_vien_tham_chieu IN ? AND ma_hoc_ky_tham_chieu = ? AND trang_thai = N'Giảng Viên Đã Chấm'", danhsachsinhvien, mahocky).Count(&count)
			if result.Error != nil {
				c.JSON(400, gin.H{
					"error": "Count trangthai bangdiem failed",
				})
				return
			}

			// Set trangthai
			var trangthai string
			if count != 0 && count == int64(len(danhsachsinhvien)) {
				trangthai = "Giảng Viên Đã Chấm"
			} else {
				trangthai = "Giảng Viên Chưa Chấm"
			}

			// Append output data
			class_results = append(class_results, classResult{
				MaLopSinhHoat: class_item.MaLopSinhHoat,
				TenLop:        class_item.TenLop,
				TenGiangVien:  tengiangvien.HoDem + " " + tengiangvien.Ten,
				TrangThai:     trangthai,
			})
		}

		c.JSON(200, gin.H{
			"danh_sach_theo_lop": class_results,
		})
	} else {
		// Query data lopsinhhoat by magiangvien and mahocky
		type Classes struct {
			MaLopSinhHoat    string `gorm:"column:ma_lop_sinh_hoat"`
			TenLop           string `gorm:"column:ten_lop"`
			Magiangviencovan string `gorm:"column:ma_giang_vien_co_van"`
		}
		var classes []Classes
		result := initialize.DB.Model(&model.LopSinhHoat{}).
			Joins("JOIN LopSinhHoatHocKy ON LopSinhHoat.ma_lop_sinh_hoat = LopSinhHoatHocKy.ma_lop_sinh_hoat_tham_chieu").
			Where("LopSinhHoatHocKy.ma_giang_vien_co_van = ? AND LopSinhHoatHocKy.ma_hoc_ky_tham_chieu = ?", magiangvien, mahocky).
			Select("LopSinhHoat.ma_lop_sinh_hoat, LopSinhHoat.ten_lop, LopSinhHoatHocKy.ma_giang_vien_co_van").
			Find(&classes)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Query classes failed",
			})
			return
		}

		var class_results []classResult

		for _, class_item := range classes {
			// Get tengiangvien by magiangviencovan
			type Tengiangvien struct {
				HoDem string `json:"ho_dem"`
				Ten   string `json:"ten"`
			}
			var tengiangvien Tengiangvien
			result = initialize.DB.Model(&model.GiangVien{}).Where("ma_giang_vien = ?", class_item.Magiangviencovan).Select("ho_dem", "ten").Find(&tengiangvien)
			if result.Error != nil {
				c.JSON(400, gin.H{
					"error": "Query tengiangvien failed",
				})
				return
			}

			// Get masinhvien by malopsinhhoat
			var danhsachsinhvien []string
			result = initialize.DB.Model(&model.LopSinhHoatSinhVien{}).Distinct("ma_sinh_vien_tham_chieu").Where("ma_lop_sinh_hoat_tham_chieu = ?", class_item.MaLopSinhHoat).Select("ma_sinh_vien_tham_chieu").Find(&danhsachsinhvien)
			if result.Error != nil {
				c.JSON(400, gin.H{
					"error": "Query danhsachsinhvien failed",
				})
				return
			}

			// Count trangthai bangdiem by sinhvien
			var count int64
			result = initialize.DB.Model(&model.SinhVienDiemRenLuyen{}).Where("ma_sinh_vien_tham_chieu IN ? AND ma_hoc_ky_tham_chieu = ? AND trang_thai = N'Lớp Trưởng Đã Chấm'", danhsachsinhvien, mahocky).Count(&count)
			if result.Error != nil {
				c.JSON(400, gin.H{
					"error": "Count trangthai bangdiem failed",
				})
				return
			}

			// Set trangthai
			var trangthai string
			if count != 0 && count == int64(len(danhsachsinhvien)) {
				trangthai = "Lớp Trưởng Đã Chấm"
			} else {
				trangthai = "Lớp Trưởng Chưa Chấm"
			}

			// Append output data
			class_results = append(class_results, classResult{
				MaLopSinhHoat: class_item.MaLopSinhHoat,
				TenLop:        class_item.TenLop,
				TenGiangVien:  tengiangvien.HoDem + " " + tengiangvien.Ten,
				TrangThai:     trangthai,
			})
		}

		c.JSON(200, gin.H{
			"danh_sach_theo_lop": class_results,
		})
	}
}
