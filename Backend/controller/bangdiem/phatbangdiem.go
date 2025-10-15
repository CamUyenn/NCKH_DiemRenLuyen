package bangdiem

import (
	"Backend/initialize"
	"Backend/model"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

func PhatBangDiem(c *gin.Context) {
	// Fetch mabangdiem and mahocky from JSON
	type DataInput struct {
		Mabangdiem string `json:"ma_bang_diem_phat"`
		Mahocky    string `json:"ma_hoc_ky_phat"`
	}

	var datainput DataInput

	if err := c.ShouldBindJSON(&datainput); err != nil {
		c.JSON(400, gin.H{
			"error": "Fetch mabangdiem and mahocky from JSON failed",
		})
		return
	}

	// Query danhsachsinhvien in database by mahocky
	var danhsachsinhvien []string

	result := initialize.DB.Model(&model.LopSinhHoatSinhVien{}).Select("ma_sinh_vien_tham_chieu").Where("ma_hoc_ky_tham_chieu = ?", datainput.Mahocky).Find(&danhsachsinhvien)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Query danhsachsinhvien in database failed",
		})
		return
	}

	// Create masinhviendiemrenluyen
	danhsachsinhviendiemrenluyen := make([]model.SinhVienDiemRenLuyen, len(danhsachsinhvien))

	for i := range danhsachsinhviendiemrenluyen {
		danhsachsinhviendiemrenluyen[i].MaSinhVienDiemRenLuyen = danhsachsinhvien[i] + "#" + datainput.Mabangdiem
		danhsachsinhviendiemrenluyen[i].MaHocKyThamChieu = datainput.Mahocky
		danhsachsinhviendiemrenluyen[i].MaBangDiemThamChieu = datainput.Mabangdiem
		danhsachsinhviendiemrenluyen[i].MaSinhVienThamChieu = danhsachsinhvien[i]
	}

	// Create new sinhviendiemrenluyen
	result = initialize.DB.Create(&danhsachsinhviendiemrenluyen)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Create new sinhviendiemrenluyen failed",
		})
		return
	}

	// Query danhsachtieuchi by mabangdiem
	var danhsachtieuchi []model.BangDiemChiTiet

	result = initialize.DB.Where("ma_bang_diem_tham_chieu = ?", datainput.Mabangdiem).Find(&danhsachtieuchi)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Query danhsachtieuchi by mabangdiem failed",
		})
		return
	}

	// Create danhsachmasinhviendiemrenluyenchitiet
	var danhsachmasinhviendiemrenluyenchitiet []string

	for _, tieuchixuly := range danhsachtieuchi {
		for _, masinhvienxuly := range danhsachsinhvien {
			danhsachmasinhviendiemrenluyenchitiet = append(danhsachmasinhviendiemrenluyenchitiet, masinhvienxuly+"#"+tieuchixuly.MaTieuChi)
		}
	}

	// Create danhsachsinhviendiemrenluyenchitiet
	danhsachsinhviendiemrenluyenchitiet := make([]model.SinhVienDiemRenLuyenChiTiet, len(danhsachsinhvien)*len(danhsachtieuchi))
	for _, tieuchixuly := range danhsachtieuchi {
		for i := range danhsachsinhviendiemrenluyenchitiet {
			// Verify matieuchi
			slices := strings.Split(danhsachmasinhviendiemrenluyenchitiet[i], "#")

			if tieuchixuly.MaTieuChi == slices[1] {
				danhsachsinhviendiemrenluyenchitiet[i].MaSinhVienDiemRenLuyenChiTiet = danhsachmasinhviendiemrenluyenchitiet[i]
				masinhviendiemrenluyenthamchieu := strings.Split(danhsachmasinhviendiemrenluyenchitiet[i], "+")
				danhsachsinhviendiemrenluyenchitiet[i].MaSinhVienDiemRenLuyenThamChieu = masinhviendiemrenluyenthamchieu[0]
				danhsachsinhviendiemrenluyenchitiet[i].MaTieuChiThamChieu = tieuchixuly.MaTieuChi
				danhsachsinhviendiemrenluyenchitiet[i].TenTieuChi = tieuchixuly.TenTieuChi
				danhsachsinhviendiemrenluyenchitiet[i].MucDiem = tieuchixuly.MucDiem
				danhsachsinhviendiemrenluyenchitiet[i].Muc = tieuchixuly.Muc
				danhsachsinhviendiemrenluyenchitiet[i].Diem = tieuchixuly.Diem
				danhsachsinhviendiemrenluyenchitiet[i].MoTaDiem = tieuchixuly.MoTaDiem
				danhsachsinhviendiemrenluyenchitiet[i].MaTieuChiCha = tieuchixuly.MaTieuChiCha
				danhsachsinhviendiemrenluyenchitiet[i].LoaiTieuChi = tieuchixuly.LoaiTieuChi
				danhsachsinhviendiemrenluyenchitiet[i].SoLan = tieuchixuly.SoLan
			}
		}
	}

	// Update ngayphat and thoihannop
	now := time.Now()

	updateData := model.BangDiem{
		NgayPhat:   now,
		ThoiHanNop: now.AddDate(0, 1, 0),
	}

	result = initialize.DB.Model(&model.BangDiem{}).Where("ma_bang_diem = ?", datainput.Mabangdiem).Updates(updateData)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Update ngayphat and thoihannop failed",
		})
		return
	}

	// Create new sinhviendiemrenluyenchitiet in database
	result = initialize.DB.Create(&danhsachsinhviendiemrenluyenchitiet)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Create new sinhviendiemrenluyenchitiet failed",
		})
		return
	} else {
		c.JSON(200, gin.H{
			"message": "Create new sinhviendiemrenluyenchitiet successful",
		})
	}
}
