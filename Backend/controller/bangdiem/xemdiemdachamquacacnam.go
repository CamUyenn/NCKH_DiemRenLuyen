package bangdiem

import (
	"Backend/initialize"
	"Backend/model"

	"github.com/gin-gonic/gin"
)

func XemDiemDaChamQuaCacNam(c *gin.Context) {
	masinhvieninput := c.Param("masinhvien")

	type Sinhviendiemrenluyencacnam struct {
		Hocky        string `json:"hocky"`
		Mabangdiem   string `json:"mabangdiem"`
		Diemsinhvien int    `json:"diemsinhvien"`
		Xeploai      string `json:"xeploai"`
	}

	var sinhviendiemrenluyencacnam []Sinhviendiemrenluyencacnam

	// Query into model first, then map to output struct
	var sinhviendiemrenluyenxuly []model.SinhVienDiemRenLuyen
	result := initialize.DB.Select("ma_hoc_ky_tham_chieu", "ma_bang_diem_tham_chieu", "tong_diem_chuyen_vien_dao_tao", "xep_loai_chuyen_vien_dao_tao").Where("ma_sinh_vien_tham_chieu = ? AND trang_thai = ?", masinhvieninput, "Chuyên Viên Đào Tạo Đã Duyệt").Find(&sinhviendiemrenluyenxuly)
	if result.Error != nil {
		c.JSON(400, gin.H{"error": "Query sinhviendiemrenluyen failed"})
		return
	}

	for _, svrl := range sinhviendiemrenluyenxuly {
		sinhviendiemrenluyencacnam = append(sinhviendiemrenluyencacnam, Sinhviendiemrenluyencacnam{
			Hocky:        svrl.MaHocKyThamChieu,
			Mabangdiem:   svrl.MaBangDiemThamChieu,
			Diemsinhvien: svrl.TongDiemChuyenVienDaoTao,
			Xeploai:      svrl.XepLoaiChuyenVienDaoTao,
		})
	}

	c.JSON(200, gin.H{"data": sinhviendiemrenluyencacnam})
}
