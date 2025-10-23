package tieuchi

import (
	"Backend/initialize"

	"github.com/gin-gonic/gin"
)

func SaoChepDiem(c *gin.Context) {
	// Fetch mabangdiem and type from JSON
	type DataInput struct {
		MaBangDiem string `json:"ma_bang_diem"`
		Type       string `json:"type"`
	}

	var datainput DataInput
	if err := c.ShouldBindJSON(&datainput); err != nil {
		c.JSON(400, gin.H{
			"error": "Fetch mabangdiem and type failed",
		})
		return
	}

	// Check type and copy diem
	switch datainput.Type {
	case "loptruong":
		result := initialize.DB.Exec("UPDATE SinhVienDiemRenLuyenChiTiet SET diem_lop_truong_danh_gia = diem_sinh_vien_danh_gia WHERE ma_sinh_vien_diem_ren_luyen_tham_chieu = ?", datainput.MaBangDiem)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Copy diemsinhviendanhgia failed",
			})
			return
		}

		c.JSON(200, gin.H{
			"message": "Copy diemsinhviendanhgia success",
		})
	case "giangvien":
		result := initialize.DB.Exec("UPDATE SinhVienDiemRenLuyenChiTiet SET diem_giang_vien_danh_gia = diem_lop_truong_danh_gia WHERE ma_sinh_vien_diem_ren_luyen_tham_chieu = ?", datainput.MaBangDiem)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Copy diemgiangviendanhgia failed",
			})
			return
		}

		c.JSON(200, gin.H{
			"message": "Copy diemgiangviendanhgia success",
		})
	case "truongkhoa":
		result := initialize.DB.Exec("UPDATE SinhVienDiemRenLuyenChiTiet SET diem_truong_khoa_danh_gia = diem_giang_vien_danh_gia WHERE ma_sinh_vien_diem_ren_luyen_tham_chieu = ?", datainput.MaBangDiem)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Copy diemtruongkhoadanhgia failed",
			})
			return
		}

		c.JSON(200, gin.H{
			"message": "Copy diemtruongkhoadanhgia success",
		})
	case "chuyenvien":
		result := initialize.DB.Exec("UPDATE SinhVienDiemRenLuyenChiTiet SET diem_chuyen_vien_dao_tao = diem_truong_khoa_danh_gia WHERE ma_sinh_vien_diem_ren_luyen_tham_chieu = ?", datainput.MaBangDiem)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Copy diemchuyenviendaotao failed",
			})
			return
		}

		c.JSON(200, gin.H{
			"message": "Copy diemchuyenviendaotao success",
		})
	}
}
