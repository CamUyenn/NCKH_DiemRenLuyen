package bangdiem

import (
	"Backend/initialize"
	"Backend/model"

	"github.com/gin-gonic/gin"
)

func ThayDoiTrangThai(c *gin.Context) {
	type Datainput struct {
		MaBangDiem string `json:"ma_bang_diem"`
		Type       string `json:"type"`
	}

	var datainput Datainput
	// Fetch mabangdiem and type from JSON
	if err := c.ShouldBindJSON(&datainput); err != nil {
		c.JSON(400, gin.H{
			"error": "Fetch mabangdiem and type from JSON failed",
		})
		return
	}
	var trangthaihientai string
	var trangthaioutput string

	// Check type
	switch datainput.Type {
	case "sinhvien":
		result := initialize.DB.Model(&model.SinhVienDiemRenLuyen{}).Select("trang_thai").Where("ma_sinh_vien_diem_ren_luyen = ?", datainput.MaBangDiem).First(&trangthaihientai)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Query trangthai from database failed",
			})
			return
		}
		// Check trangthai value
		switch trangthaihientai {
		case "Đã Phát":
			trangthaioutput = "Sinh Viên Đã Chấm"
		default:
			trangthaioutput = "Sinh Viên Đã Chấm"
		}
	case "loptruong":
		result := initialize.DB.Model(&model.SinhVienDiemRenLuyen{}).Select("trang_thai").Where("ma_sinh_vien_diem_ren_luyen = ?", datainput.MaBangDiem).First(&trangthaihientai)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Query trangthai from database failed",
			})
			return
		}
		// Check trangthai value
		switch trangthaihientai {
		case "Sinh Viên Đã Chấm":
			trangthaioutput = "Lớp Trưởng Đã Chấm"
		default:
			trangthaioutput = "Lớp Trưởng Đã Chấm"
		}
	case "giangvien":
		result := initialize.DB.Model(&model.SinhVienDiemRenLuyen{}).Select("trang_thai").Where("ma_sinh_vien_diem_ren_luyen = ?", datainput.MaBangDiem).First(&trangthaihientai)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Query trangthai from database failed",
			})
			return
		}
		// Check trangthai value
		switch trangthaihientai {
		case "Lớp Trưởng Đã Duyệt":
			trangthaioutput = "Giảng Viên Đã Chấm"
		default:
			trangthaioutput = "Giảng Viên Đã Chấm"
		}
	case "truongkhoa":
		result := initialize.DB.Model(&model.SinhVienDiemRenLuyen{}).Select("trang_thai").Where("ma_sinh_vien_diem_ren_luyen = ?", datainput.MaBangDiem).First(&trangthaihientai)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Query trangthai from database failed",
			})
			return
		}
		// Check trangthai value
		switch trangthaihientai {
		case "Giảng Viên Đã Chấm":
			trangthaioutput = "Trưởng Khoa Đã Duyệt"
		default:
			trangthaioutput = "Trưởng Khoa Đã Duyệt"
		}
	case "chuyenviendaotao":
		result := initialize.DB.Model(&model.SinhVienDiemRenLuyen{}).Select("trang_thai").Where("ma_sinh_vien_diem_ren_luyen = ?", datainput.MaBangDiem).First(&trangthaihientai)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Query trangthai from database failed",
			})
			return
		}
		// Check trangthai value
		switch trangthaihientai {
		case "Trưởng Khoa Đã Duyệt":
			trangthaioutput = "Chuyên Viên Đào Tạo Đã Duyệt"
		default:
			trangthaioutput = "Chuyên Viên Đào Tạo Đã Duyệt"
		}
	}

	// Update TrangThai
	result := initialize.DB.Model(&model.SinhVienDiemRenLuyen{}).Where("ma_sinh_vien_diem_ren_luyen = ?", datainput.MaBangDiem).Update("trang_thai", trangthaioutput)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Update trangthai failed",
		})
		return
	}
	c.JSON(200, gin.H{
		"message": "Update trangthai successful",
	})
}
