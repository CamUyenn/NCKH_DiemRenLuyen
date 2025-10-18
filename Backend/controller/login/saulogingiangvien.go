package login

import (
	"Backend/initialize"
	"Backend/model"
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
)

func SauLoginGiangVien(c *gin.Context) {
	// Bind JSON input
	type datainput struct {
		MaGiangVien string `json:"ma_giang_vien"`
		Typeinput   string `json:"type"`
	}
	var datainputx datainput

	if err := c.ShouldBindJSON(&datainputx); err != nil {
		c.JSON(400, gin.H{
			"error": "Fetch ma_giang_vien and type from json failed",
		})
		return
	}

	// Build default ma hoc ky from current month/year
	now := time.Now()
	year := now.Year()
	month := int(now.Month())

	var mahocky string
	if month >= 5 && month <= 11 {
		mahocky = fmt.Sprintf("%d-%d.%d", year, year+1, 1)
	} else {
		mahocky = fmt.Sprintf("%d-%d.%d", year-1, year, 2)
	}

	// Query LopSinhHoatHocKy for the mahocky
	var lopsinhhoathockylist []model.LopSinhHoatHocKy
	result := initialize.DB.Where("ma_hoc_ky_tham_chieu = ?", mahocky).Find(&lopsinhhoathockylist)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Query lopsinhhoathocky failed",
		})
		return
	}

	// Determine type and collect list of ma_lop_sinh_hoat
	var danhsachmalopsinhhoat []string
	var typenew string

	// First check giangvien matches
	for _, item := range lopsinhhoathockylist {
		if item.MaGiangVienCoVan == datainputx.MaGiangVien {
			danhsachmalopsinhhoat = append(danhsachmalopsinhhoat, item.MaLopSinhHoatThamChieu)
		}
	}
	if len(danhsachmalopsinhhoat) > 0 {
		typenew = "giangvien"
	} else {
		// Check truong khoa
		for _, item := range lopsinhhoathockylist {
			if item.MaTruongKhoa == datainputx.MaGiangVien {
				danhsachmalopsinhhoat = append(danhsachmalopsinhhoat, item.MaLopSinhHoatThamChieu)
			}
		}
		if len(danhsachmalopsinhhoat) > 0 {
			typenew = "truongkhoa"
		} else {
			// Check chuyen vien dao tao
			for _, item := range lopsinhhoathockylist {
				if item.MaChuyenVienDaoTao == datainputx.MaGiangVien {
					danhsachmalopsinhhoat = append(danhsachmalopsinhhoat, item.MaLopSinhHoatThamChieu)
				}
			}
			if len(danhsachmalopsinhhoat) > 0 {
				typenew = "chuyenviendaotao"
			} else {
				// Default to giangvien with empty list
				typenew = "giangvien"
			}
		}
	}

	c.JSON(200, gin.H{
		"ma_giang_vien":              datainputx.MaGiangVien,
		"ma_hoc_ky":                  mahocky,
		"danh_sach_ma_lop_sinh_hoat": danhsachmalopsinhhoat,
		"type":                       typenew,
	})
}
