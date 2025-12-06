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
		// Copy diemsinhviendanhgia to diemloptruong in SinhVienDiemRenLuyenChiTiet

		result := initialize.DB.Exec("UPDATE SinhVienDiemRenLuyenChiTiet SET diem_lop_truong_danh_gia = diem_sinh_vien_danh_gia WHERE ma_sinh_vien_diem_ren_luyen_tham_chieu = ?", datainput.MaBangDiem)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Copy diemsinhviendanhgia failed",
			})
			return
		}

		// Copy tongdiemsinhvien to tongdiemloptruong in SinhVienDiemRenLuyen

		result = initialize.DB.Exec("UPDATE SinhVienDiemRenLuyen SET tong_diem_lop_truong = tong_diem_sinh_vien, xep_loai_lop_truong = xep_loai_sinh_vien WHERE ma_sinh_vien_diem_ren_luyen = ?", datainput.MaBangDiem)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Copy tongdiemsinhviendanhgia failed",
			})
			return
		}

		c.JSON(200, gin.H{
			"message": "Copy diemsinhviendanhgia success",
		})
	case "giangvien":
		// Copy diemloptruong to diemgiangvien in SinhVienDiemRenLuyenChiTiet
		result := initialize.DB.Exec("UPDATE SinhVienDiemRenLuyenChiTiet SET diem_giang_vien_danh_gia = diem_lop_truong_danh_gia WHERE ma_sinh_vien_diem_ren_luyen_tham_chieu = ?", datainput.MaBangDiem)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Copy diemgiangviendanhgia failed",
			})
			return
		}

		// Copy tongdiemloptruong to tongdiemcovan in SinhVienDiemRenLuyen
		result = initialize.DB.Exec("UPDATE SinhVienDiemRenLuyen SET tong_diem_co_van = tong_diem_lop_truong, xep_loai_co_van = xep_loai_lop_truong WHERE ma_sinh_vien_diem_ren_luyen = ?", datainput.MaBangDiem)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Copy tongdiemloptruong failed",
			})
			return
		}

		c.JSON(200, gin.H{
			"message": "Copy diemgiangviendanhgia success",
		})
	case "truongkhoa":
		// Copy diemgiangvien to diemtruongkhoa in SinhVienDiemRenLuyenChiTiet
		result := initialize.DB.Exec("UPDATE SinhVienDiemRenLuyenChiTiet SET diem_truong_khoa_danh_gia = diem_giang_vien_danh_gia WHERE ma_sinh_vien_diem_ren_luyen_tham_chieu = ?", datainput.MaBangDiem)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Copy diemtruongkhoadanhgia failed",
			})
			return
		}

		// Copy tongdiemcovan to tongdiemtruongkhoa in SinhVienDiemRenLuyen
		result = initialize.DB.Exec("UPDATE SinhVienDiemRenLuyen SET tong_diem_truong_khoa = tong_diem_co_van, xep_loai_truong_khoa = xep_loai_co_van WHERE ma_sinh_vien_diem_ren_luyen = ?", datainput.MaBangDiem)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Copy tongdiemcovan failed",
			})
			return
		}

		c.JSON(200, gin.H{
			"message": "Copy diemtruongkhoadanhgia success",
		})
	case "chuyenviendaotao":
		// Copy diemtruongkhoa to diemchuyenviendaotao in SinhVienDiemRenLuyenChiTiet
		result := initialize.DB.Exec("UPDATE SinhVienDiemRenLuyenChiTiet SET diem_chuyen_vien_dao_tao = diem_truong_khoa_danh_gia WHERE ma_sinh_vien_diem_ren_luyen_tham_chieu = ?", datainput.MaBangDiem)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Copy diemchuyenviendaotao failed",
			})
			return
		}

		// Copy tongdiemtruongkhoa to tongdiemchuyenviendaotao in SinhVienDiemRenLuyen
		result = initialize.DB.Exec("UPDATE SinhVienDiemRenLuyen SET tong_diem_chuyen_vien_dao_tao = tong_diem_truong_khoa, xep_loai_chuyen_vien_dao_tao = xep_loai_truong_khoa WHERE ma_sinh_vien_diem_ren_luyen = ?", datainput.MaBangDiem)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Copy tongdiemtruongkhoa failed",
			})
			return
		}

		c.JSON(200, gin.H{
			"message": "Copy diemchuyenviendaotao success",
		})
	}
}
