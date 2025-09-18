package tieuchi

import (
	"Backend/controller/bangdiem"
	"Backend/controller/hocky"
	"Backend/initialize"
	"Backend/model"
	"strconv"

	"github.com/gin-gonic/gin"
)

type HocKy_DanhSachTieuChi struct {
	MaHocKy         string                  `json:"ma_hoc_ky"`
	DanhSachTieuChi []model.BangDiemChiTiet `json:"danh_sach_tieu_chi"`
}

func TaoTieuChi(c *gin.Context) {
	var tieuchi HocKy_DanhSachTieuChi

	// Extract data from JSON
	if err := c.ShouldBindJSON(&tieuchi); err != nil {
		c.JSON(400, gin.H{
			"error": "Khong lay duoc du lieu tu JSON",
		})
		return
	}

	// Create HocKy
	hocky.TaoHocKy(c, tieuchi.MaHocKy)

	// Create BangDiem
	MaBangDiem := tieuchi.MaHocKy + "_BD"
	bangdiem.TaoBangDiem(c, MaBangDiem)

	// Create BangDiemChiTiet
	for _, TieuChi := range tieuchi.DanhSachTieuChi {
		MucDiem := strconv.Itoa(TieuChi.MucDiem)
		TieuChi.MaTieuChi = MaBangDiem + "_" + MucDiem + "_" + TieuChi.Muc
		TieuChi.MaBangDiemThamChieu = MaBangDiem

		result := initialize.DB.Create(&TieuChi)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Tao tieu chi khong thanh cong",
			})
			return
		}
	}
}
