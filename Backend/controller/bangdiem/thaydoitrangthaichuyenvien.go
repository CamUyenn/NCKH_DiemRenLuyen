package bangdiem

import (
	"Backend/initialize"
	"Backend/model"

	"github.com/gin-gonic/gin"
)

func ThayDoiTrangThaiChuyenVien(c *gin.Context) {
	type Datainput struct {
		MaKhoa  []string `json:"makhoa"`
		MaHocKy string   `json:"mahocky"`
		Type    string   `json:"type"`
	}

	var datainput Datainput
	if err := c.ShouldBindJSON(&datainput); err != nil {
		c.JSON(400, gin.H{
			"error": "Fetch makhoa and type from JSON failed",
		})
		return
	}

	trangthaioutput := "Chuyên Viên Đã Chấm"

	var danhsachmalopsinhhoat []string
	result := initialize.DB.Model(&model.LopSinhHoatHocKy{}).Select("ma_lop_sinh_hoat_tham_chieu").Where("ma_khoa_tham_chieu IN ? AND ma_hoc_ky_tham_chieu = ?", datainput.MaKhoa, datainput.MaHocKy).Find(&danhsachmalopsinhhoat)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Failed to fetch danhsachlopsinhhoat from the database",
		})
		return
	}

	var danhsachmasinhvien []string
	result = initialize.DB.Model(&model.LopSinhHoatSinhVien{}).Select("ma_sinh_vien_tham_chieu").Where("ma_lop_sinh_hoat_tham_chieu IN ? AND ma_hoc_ky_tham_chieu = ?", danhsachmalopsinhhoat, datainput.MaHocKy).Find(&danhsachmasinhvien)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Failed to fetch danhsachmasinhvien from the database",
		})
		return
	}

	result = initialize.DB.Model(&model.SinhVienDiemRenLuyen{}).Where("ma_sinh_vien_tham_chieu IN ? AND ma_hoc_ky_tham_chieu = ?", danhsachmasinhvien, datainput.MaHocKy).Update("trang_thai", trangthaioutput)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Failed to update status in the database",
		})
		return
	}

	c.JSON(200, gin.H{
		"message": "Status updated successfully",
	})
}
