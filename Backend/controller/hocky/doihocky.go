package hocky

import (
	"Backend/initialize"
	"Backend/model"

	"github.com/gin-gonic/gin"
)

func DoiHocKy(c *gin.Context) {
	// Fetch mahocky, manguoidung, type from JSON
	type DoiHocKyRequest struct {
		Mahocky     string `json:"ma_hoc_ky"`     // Semester ID
		Manguoidung string `json:"ma_nguoi_dung"` // User ID
		Type        string `json:"type"`          // User type
	}

	var req DoiHocKyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{
			"error": "Fetch mahocky, manguoidung, type from JSON failed",
		})
		return
	}

	mahocky := req.Mahocky
	manguoidung := req.Manguoidung
	loai := req.Type

	// Check if user is sinhvien or loptruong
	if loai == "sinhvien" || loai == "loptruong" {
		var lopsinhhoatsinhvien model.LopSinhHoatSinhVien
		// Find lopsinhhoatsinhvien
		result := initialize.DB.Where("ma_sinh_vien_tham_chieu = ? AND ma_hoc_ky_tham_chieu = ?", manguoidung, mahocky).First(&lopsinhhoatsinhvien)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Find lopsinhhoatsinhvien failed",
			})
			return
		}
		malopsinhhoat := lopsinhhoatsinhvien.MaLopSinhHoatThamChieu

		var lopsinhhoathocky model.LopSinhHoatHocKy
		// Find lopsinhhoathocky
		result2 := initialize.DB.Where("ma_lop_sinh_hoat_tham_chieu = ? AND ma_hoc_ky_tham_chieu = ?", malopsinhhoat, mahocky).First(&lopsinhhoathocky)
		if result2.Error != nil {
			c.JSON(400, gin.H{
				"error": "Find lopsinhhoathocky failed",
			})
			return
		}
		maloptruong := lopsinhhoathocky.MaLopTruong

		// Check loptruong
		if manguoidung == maloptruong {
			loai = "loptruong"
		} else {
			loai = "sinhvien"
		}

		c.JSON(200, gin.H{
			"mahocky":       mahocky,
			"masinhvien":    manguoidung,
			"malopsinhhoat": malopsinhhoat,
			"type":          loai,
		})
		return
	}

	var count int64
	// Check if user is giangvien or truongkhoa or chuyenviendaotao
	switch loai {
	case "giangvien":
		// Check if nguoidung is giangvien by hocky
		initialize.DB.Model(&model.LopSinhHoatHocKy{}).Where("ma_giang_vien_co_van = ? AND ma_hoc_ky_tham_chieu = ?", manguoidung, mahocky).Count(&count)
		if count > 0 {
			loai = "giangvien"
		} else {
			// Check if nguoidung is truongkhoa by hocky
			initialize.DB.Model(&model.LopSinhHoatHocKy{}).Where("ma_truong_khoa = ? AND ma_hoc_ky_tham_chieu = ?", manguoidung, mahocky).Count(&count)
			if count > 0 {
				loai = "truongkhoa"
			} else {
				// Check if nguoidung is chuyenviendaotao by hocky
				initialize.DB.Model(&model.LopSinhHoatHocKy{}).Where("ma_chuyen_vien_dao_tao = ? AND ma_hoc_ky_tham_chieu = ?", manguoidung, mahocky).Count(&count)
				if count > 0 {
					loai = "chuyenviendaotao"
				}
			}
		}
	case "truongkhoa":
		// Check if nguoidung is truongkhoa by hocky
		initialize.DB.Model(&model.LopSinhHoatHocKy{}).Where("ma_truong_khoa = ? AND ma_hoc_ky_tham_chieu = ?", manguoidung, mahocky).Count(&count)
		if count > 0 {
			loai = "truongkhoa"
		} else {
			// Check if nguoidung is giangvien by hocky
			initialize.DB.Model(&model.LopSinhHoatHocKy{}).Where("ma_giang_vien_co_van = ? AND ma_hoc_ky_tham_chieu = ?", manguoidung, mahocky).Count(&count)
			if count > 0 {
				loai = "giangvien"
			} else {
				// Check if nguoidung is chuyenviendaotao by hocky
				initialize.DB.Model(&model.LopSinhHoatHocKy{}).Where("ma_chuyen_vien_dao_tao = ? AND ma_hoc_ky_tham_chieu = ?", manguoidung, mahocky).Count(&count)
				if count > 0 {
					loai = "chuyenviendaotao"
				} else {
					loai = "giangvien" // Default to giangvien if not found
				}
			}
		}
	case "chuyenviendaotao":
		// Check if nguoidung is chuyenviendaotao by hocky
		initialize.DB.Model(&model.LopSinhHoatHocKy{}).Where("ma_chuyen_vien_dao_tao = ? AND ma_hoc_ky_tham_chieu = ?", manguoidung, mahocky).Count(&count)
		if count > 0 {
			loai = "chuyenviendaotao"
		} else {
			// Check if nguoidung is truongkhoa by hocky
			initialize.DB.Model(&model.LopSinhHoatHocKy{}).Where("ma_giang_vien_co_van = ? AND ma_hoc_ky_tham_chieu = ?", manguoidung, mahocky).Count(&count)
			if count > 0 {
				loai = "giangvien"
			} else {
				// Check if nguoidung is giangvien by hocky
				initialize.DB.Model(&model.LopSinhHoatHocKy{}).Where("ma_truong_khoa = ? AND ma_hoc_ky_tham_chieu = ?", manguoidung, mahocky).Count(&count)
				if count > 0 {
					loai = "truongkhoa"
				} else {
					loai = "giangvien" // Default to giangvien if not found
				}
			}
		}
	}

	c.JSON(200, gin.H{
		"mahocky":     mahocky,
		"manguoidung": manguoidung,
		"type":        loai,
	})
}
