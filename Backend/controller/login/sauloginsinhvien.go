package login

import (
	"Backend/initialize"
	"Backend/model"

	"github.com/gin-gonic/gin"
)

func SauLoginSinhVien(c *gin.Context) {
	// Bind JSON input
	type datainput struct {
		MaSinhVien string `json:"ma_sinh_vien"`
		MatKhau    string `json:"mat_khau"`
		Typeinput  string `json:"type"`
	}
	var datainputx datainput

	if err := c.ShouldBindJSON(&datainputx); err != nil {
		c.JSON(400, gin.H{
			"error": "Fetch masinhvien and type from json failed",
		})
		return
	}

	// Verify sinh vien credentials
	var countmodel int64

	result := initialize.DB.Model(&model.SinhVien{}).Where("ma_sinh_vien = ? AND mat_khau = ?", datainputx.MaSinhVien, datainputx.MatKhau).Count(&countmodel)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Query sinhvien failed",
		})
		return
	}

	if countmodel == 0 {
		c.JSON(400, gin.H{
			"error": "Invalid ma_sinh_vien or mat_khau",
		})
		return
	}

	// Query list lopsinhhoatsinhvien by masinhvien
	var lopsinhhoatsinhvienlist []model.LopSinhHoatSinhVien
	result = initialize.DB.Where("ma_sinh_vien_tham_chieu = ?", datainputx.MaSinhVien).Find(&lopsinhhoatsinhvienlist)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Query lopsinhhoatsinhvien failed",
		})
		return
	}

	// Collect list hocky
	var danhsachmahocky []string
	for _, item := range lopsinhhoatsinhvienlist {
		danhsachmahocky = append(danhsachmahocky, item.MaHocKyThamChieu)
	}
	if len(danhsachmahocky) == 0 {
		c.JSON(400, gin.H{
			"error": "No hocky found for sinhvien",
		})
		return
	}

	// Find the latest hocky
	mahockylonnhat := danhsachmahocky[0]
	for _, mahocky := range danhsachmahocky {
		if mahocky > mahockylonnhat {
			mahockylonnhat = mahocky
		}
	}

	// Find malopsinhhoat by the latest hocky
	var malopsinhhoat string
	for _, item := range lopsinhhoatsinhvienlist {
		if item.MaHocKyThamChieu == mahockylonnhat {
			malopsinhhoat = item.MaLopSinhHoatThamChieu
			break
		}
	}

	// Query lopsinhhoathocky
	var lopsinhhoathocky model.LopSinhHoatHocKy
	result = initialize.DB.
		Where("ma_lop_sinh_hoat_tham_chieu = ? AND ma_hoc_ky_tham_chieu = ?", malopsinhhoat, mahockylonnhat).First(&lopsinhhoathocky)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Query lopsinhhoathocky failed",
		})
		return
	}

	// Check loptruong
	maloptruong := lopsinhhoathocky.MaLopTruong
	typenew := datainputx.Typeinput
	if maloptruong == datainputx.MaSinhVien {
		typenew = "loptruong"
	}

	// Query mabangdiem
	var mabangdiemoutput string
	result = initialize.DB.Model(model.SinhVienDiemRenLuyenChiTiet{}).Select("ma_sinh_vien_diem_ren_luyen").Where("ma_hoc_ky_tham_chieu = ? AND ma_sinh_vien_tham_chieu = ?", mahockylonnhat, datainputx.MaSinhVien).Find(&mabangdiemoutput)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Query mabangdiem failed",
		})
		return
	}

	c.JSON(200, gin.H{
		"ma_sinh_vien":     datainputx.MaSinhVien,
		"ma_hoc_ky":        mahockylonnhat,
		"ma_lop_sinh_hoat": lopsinhhoathocky.MaLopSinhHoatThamChieu,
		"ma_bang_diem":     mabangdiemoutput,
		"type":             typenew,
	})
}
