package bangdiem

import (
	"Backend/initialize"
	"Backend/model"

	"github.com/gin-gonic/gin"
)

func ThayDoiTrangThai(c *gin.Context) {
	type Datainput struct {
		MaBangDiem []string `json:"mabangdiem"`
		Type       string   `json:"type"`
	}

	var datainput Datainput
	if err := c.ShouldBindJSON(&datainput); err != nil {
		c.JSON(400, gin.H{
			"error": "Fetch mabangdiem and type from JSON failed",
		})
		return
	}

	var trangthaioutput string

	switch datainput.Type {
	case "sinhvien":
		trangthaioutput = "Sinh Viên Đã Chấm"
	case "loptruong":
		trangthaioutput = "Lớp Trưởng Đã Chấm"
	case "giangvien":
		trangthaioutput = "Giảng Viên Đã Chấm"
	case "truongkhoa":
		trangthaioutput = "Trưởng Khoa Đã Duyệt"
	case "chuyenviendaotao":
		trangthaioutput = "Chuyên Viên Đào Tạo Đã Duyệt"
	}

	result := initialize.DB.Model(&model.SinhVienDiemRenLuyen{}).Where("ma_sinh_vien_diem_ren_luyen IN ?", datainput.MaBangDiem).Update("trang_thai", trangthaioutput)
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
