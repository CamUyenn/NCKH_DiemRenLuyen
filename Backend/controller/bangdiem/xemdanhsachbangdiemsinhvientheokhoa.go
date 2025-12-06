package bangdiem

import (
	"Backend/initialize"
	"Backend/model"

	"github.com/gin-gonic/gin"
)

func XemDanhSachBangDiemSinhVienTheoKhoa(c *gin.Context) {
	machuyenvien := c.Param("machuyenvien")
	mahocky := c.Param("mahocky")

	// Output data structure
	type Output struct {
		MaKhoa        string `json:"ma_khoa"`
		TenKhoa       string `json:"ten_khoa"`
		TenTruongKhoa string `json:"ten_truong_khoa"`
		MaTruongKhoa  string `json:"ma_truong_khoa"`
		TrangThai     string `json:"trang_thai"`
	}
	var output []Output

	// Query danhsachmakhoa
	var danhsachmakhoa []string
	result := initialize.DB.Model(model.LopSinhHoatHocKy{}).Distinct("ma_khoa_tham_chieu").Select("ma_khoa_tham_chieu").Where("ma_chuyen_vien_dao_tao = ? AND ma_hoc_ky_tham_chieu = ?", machuyenvien, mahocky).Find(&danhsachmakhoa)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Failed query danhsachmakhoa",
		})
		return
	}
	for _, makhoa := range danhsachmakhoa {
		// Query thongtinkhoa
		type Thongtinkhoa struct {
			TenKhoa      string `json:"ten_khoa"`
			MaTruongKhoa string `json:"ma_truong_khoa"`
		}

		var thongtinkhoa Thongtinkhoa
		result = initialize.DB.Model(&model.Khoa{}).Select("ten_khoa", "ma_truong_khoa").Where("ma_khoa = ?", makhoa).Find(&thongtinkhoa)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Failed query tenkhoa",
			})
			return
		}

		// Query tentruongkhoa
		type Tentruongkhoa struct {
			HoDem string `json:"ho_dem"`
			Ten   string `json:"ten"`
		}
		var tentruongkhoa Tentruongkhoa
		result = initialize.DB.Model(&model.GiangVien{}).Select("ho_dem", "ten").Where("ma_giang_vien = ?", thongtinkhoa.MaTruongKhoa).Find(&tentruongkhoa)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Failed query tentruongkhoa",
			})
			return
		}

		// Query danhsachlopsinhhoat
		var danhsachmalopsinhhoat []string
		result = initialize.DB.Model(&model.LopSinhHoatHocKy{}).Distinct("ma_lop_sinh_hoat_tham_chieu").Select("ma_lop_sinh_hoat_tham_chieu").Where("ma_khoa_tham_chieu = ? AND ma_hoc_ky_tham_chieu = ?", makhoa, mahocky).Find(&danhsachmalopsinhhoat)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Failed query danhsachmalopsinhhoat",
			})
			return
		}

		// Query danhsachsinhvien
		var danhsachmasinhvien []string
		result = initialize.DB.Model(&model.LopSinhHoatSinhVien{}).Distinct("ma_sinh_vien_tham_chieu").Select("ma_sinh_vien_tham_chieu").Where("ma_lop_sinh_hoat_tham_chieu IN ? AND ma_hoc_ky_tham_chieu = ?", danhsachmalopsinhhoat, mahocky).Find(&danhsachmasinhvien)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Failed query danhsachsinhvien",
			})
			return
		}

		// Find trangthai
		var trangthaibangdiem string
		var count int64
		result = initialize.DB.Model(&model.SinhVienDiemRenLuyen{}).Where("ma_sinh_vien_tham_chieu IN ? AND ma_hoc_ky_tham_chieu = ? AND trang_thai = N'Chuyên Viên Đã Chấm'", danhsachmasinhvien, mahocky).Count(&count)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Failed count until trangthai",
			})
			return
		}

		if count != 0 {
			trangthaibangdiem = "Chuyên Viên Đã Chấm"
		} else {
			result = initialize.DB.Model(&model.SinhVienDiemRenLuyen{}).Where("ma_sinh_vien_tham_chieu IN ? AND ma_hoc_ky_tham_chieu = ? AND (trang_thai = N'Đã Phát' OR trang_thai = N'Sinh Viên Đã Chấm' OR trang_thai = N'Lớp Trưởng Đã Chấm' OR trang_thai = N'Giảng Viên Đã Chấm')", danhsachmasinhvien, mahocky).Count(&count)
			if result.Error != nil {
				c.JSON(400, gin.H{
					"error": "Failed count before trangthai",
				})
				return
			}
			if count != 0 {
				trangthaibangdiem = "Trưởng Khoa Chưa Chấm"
			} else {
				trangthaibangdiem = "Trưởng Khoa Đã Chấm"
			}
		}

		// Append to output
		output = append(output, Output{
			MaKhoa:        makhoa,
			TenKhoa:       thongtinkhoa.TenKhoa,
			TenTruongKhoa: tentruongkhoa.HoDem + " " + tentruongkhoa.Ten,
			MaTruongKhoa:  thongtinkhoa.MaTruongKhoa,
			TrangThai:     trangthaibangdiem,
		})
	}

	c.JSON(200, gin.H{
		"danh_sach_theo_khoa": output,
	})
}
