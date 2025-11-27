package tieuchi

import (
	"Backend/initialize"
	"Backend/model"
	"strings"

	"github.com/gin-gonic/gin"
)

func ChamDiem(c *gin.Context) {
	// Fetch mabangdiem and danhsachtieuchi from JSON
	type DiemInput struct {
		MaSinhVienDiemRenLuyenChiTiet string `json:"ma_sinh_vien_diem_ren_luyen_chi_tiet"`
		DiemSinhVienDanhGia           int    `json:"diem_sinh_vien_danh_gia"`
		DiemLopTruongDanhGia          int    `json:"diem_lop_truong_danh_gia"`
		DiemGiangVienDanhGia          int    `json:"diem_giang_vien_danh_gia"`
		DiemTruongKhoaDanhGia         int    `json:"diem_truong_khoa_danh_gia"`
		DiemChuyenVienDaoTao          int    `json:"diem_chuyen_vien_dao_tao"`
	}

	type DataInput struct {
		Type            string      `json:"type"`
		TongDiem        int         `json:"tong_diem"`
		Danhsachtieuchi []DiemInput `json:"danhsachdieminput"`
	}

	var datainput DataInput

	if err := c.ShouldBindJSON(&datainput); err != nil {
		c.JSON(400, gin.H{
			"error": "Fetch type and danhsachtieuchi failed",
		})
		return
	}

	//Check type and update corresponding fields
	switch datainput.Type {
	case "sinhvien":
		// Update diemsinhviendanhgia for each tieuchi
		for _, tieuchi := range datainput.Danhsachtieuchi {
			result := initialize.DB.Model(&model.SinhVienDiemRenLuyenChiTiet{}).Where("ma_sinh_vien_diem_ren_luyen_chi_tiet = ?", tieuchi.MaSinhVienDiemRenLuyenChiTiet).Updates(model.SinhVienDiemRenLuyenChiTiet{
				DiemSinhVienDanhGia: tieuchi.DiemSinhVienDanhGia,
			})
			if result.Error != nil {
				c.JSON(400, gin.H{
					"error": "Update diemsinhviendanhgia failed",
				})
				return
			}
		}

		// Update tongdiemsinhvien in SinhVienDiemRenLuyen
		var sinhviendiemrenluyenxuly []string
		sinhviendiemrenluyenxuly = strings.Split(datainput.Danhsachtieuchi[0].MaSinhVienDiemRenLuyenChiTiet, "+")

		var xeploai string
		if datainput.TongDiem > 90 {
			xeploai = "Xuất sắc"
		} else if datainput.TongDiem > 80 {
			xeploai = "Giỏi"
		} else if datainput.TongDiem > 65 {
			xeploai = "Khá"
		} else if datainput.TongDiem > 50 {
			xeploai = "Trung bình"
		} else {
			xeploai = "Yếu"
		}

		result := initialize.DB.Model(&model.SinhVienDiemRenLuyen{}).Where("ma_sinh_vien_diem_ren_luyen = ?", sinhviendiemrenluyenxuly[0]).Updates(model.SinhVienDiemRenLuyen{
			TongDiemSinhVien: datainput.TongDiem,
			XepLoaiSinhVien:  xeploai,
		})
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Update tongdiem sinhviendiemrenluyen failed",
			})
			return
		}

		c.JSON(200, gin.H{
			"message": "Update diemsinhviendanhgia successful",
		})
	case "loptruong":
		// Update diemloptruongdanhgia for each tieuchi
		for _, tieuchi := range datainput.Danhsachtieuchi {
			result := initialize.DB.Model(&model.SinhVienDiemRenLuyenChiTiet{}).Where("ma_sinh_vien_diem_ren_luyen_chi_tiet = ?", tieuchi.MaSinhVienDiemRenLuyenChiTiet).Updates(model.SinhVienDiemRenLuyenChiTiet{
				DiemLopTruongDanhGia: tieuchi.DiemLopTruongDanhGia,
			})
			if result.Error != nil {
				c.JSON(400, gin.H{
					"error": "Update diemloptruongdanhgia failed",
				})
				return
			}
		}

		// Update tongdiemloptruong in SinhVienDiemRenLuyen
		var sinhviendiemrenluyenxuly []string
		sinhviendiemrenluyenxuly = strings.Split(datainput.Danhsachtieuchi[0].MaSinhVienDiemRenLuyenChiTiet, "+")

		var xeploai string
		if datainput.TongDiem > 90 {
			xeploai = "Xuất sắc"
		} else if datainput.TongDiem > 80 {
			xeploai = "Giỏi"
		} else if datainput.TongDiem > 65 {
			xeploai = "Khá"
		} else if datainput.TongDiem > 50 {
			xeploai = "Trung bình"
		} else {
			xeploai = "Yếu"
		}

		result := initialize.DB.Model(&model.SinhVienDiemRenLuyen{}).Where("ma_sinh_vien_diem_ren_luyen = ?", sinhviendiemrenluyenxuly[0]).Updates(model.SinhVienDiemRenLuyen{
			TongDiemLopTruong: datainput.TongDiem,
			XepLoaiLopTruong:  xeploai,
		})
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Update tongdiem loptruong sinhviendiemrenluyen failed",
			})
			return
		}

		c.JSON(200, gin.H{
			"message": "Update diemloptruongdanhgia successful",
		})
	case "giangvien":
		// Update diemgiangviendanhgia for each tieuchi
		for _, tieuchi := range datainput.Danhsachtieuchi {
			result := initialize.DB.Model(&model.SinhVienDiemRenLuyenChiTiet{}).Where("ma_sinh_vien_diem_ren_luyen_chi_tiet = ?", tieuchi.MaSinhVienDiemRenLuyenChiTiet).Updates(model.SinhVienDiemRenLuyenChiTiet{
				DiemGiangVienDanhGia: tieuchi.DiemGiangVienDanhGia,
			})
			if result.Error != nil {
				c.JSON(400, gin.H{
					"error": "Update diemgiangviendanhgia failed",
				})
				return
			}
		}

		// Update tongdiemgiangvien in SinhVienDiemRenLuyen
		var sinhviendiemrenluyenxuly []string
		sinhviendiemrenluyenxuly = strings.Split(datainput.Danhsachtieuchi[0].MaSinhVienDiemRenLuyenChiTiet, "+")

		var xeploai string
		if datainput.TongDiem > 90 {
			xeploai = "Xuất sắc"
		} else if datainput.TongDiem > 80 {
			xeploai = "Giỏi"
		} else if datainput.TongDiem > 65 {
			xeploai = "Khá"
		} else if datainput.TongDiem > 50 {
			xeploai = "Trung bình"
		} else {
			xeploai = "Yếu"
		}

		result := initialize.DB.Model(&model.SinhVienDiemRenLuyen{}).Where("ma_sinh_vien_diem_ren_luyen = ?", sinhviendiemrenluyenxuly[0]).Updates(model.SinhVienDiemRenLuyen{
			TongDiemCoVan: datainput.TongDiem,
			XepLoaiCoVan:  xeploai,
		})
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Update tongdiem giangvien sinhviendiemrenluyen failed",
			})
			return
		}

		c.JSON(200, gin.H{
			"message": "Update diemgiangviendanhgia successful",
		})
	case "truongkhoa":
		// Update diemtruongkhoadanhgia for each tieuchi
		for _, tieuchi := range datainput.Danhsachtieuchi {
			result := initialize.DB.Model(&model.SinhVienDiemRenLuyenChiTiet{}).Where("ma_sinh_vien_diem_ren_luyen_chi_tiet = ?", tieuchi.MaSinhVienDiemRenLuyenChiTiet).Updates(model.SinhVienDiemRenLuyenChiTiet{
				DiemTruongKhoaDanhGia: tieuchi.DiemTruongKhoaDanhGia,
			})
			if result.Error != nil {
				c.JSON(400, gin.H{
					"error": "Update diemtruongkhoadanhgia failed",
				})
				return
			}
		}

		// Update tongdiemtruongkhoa in SinhVienDiemRenLuyen
		var sinhviendiemrenluyenxuly []string
		sinhviendiemrenluyenxuly = strings.Split(datainput.Danhsachtieuchi[0].MaSinhVienDiemRenLuyenChiTiet, "+")
		var xeploai string
		if datainput.TongDiem > 90 {
			xeploai = "Xuất sắc"
		} else if datainput.TongDiem > 80 {
			xeploai = "Giỏi"
		} else if datainput.TongDiem > 65 {
			xeploai = "Khá"
		} else if datainput.TongDiem > 50 {
			xeploai = "Trung bình"
		} else {
			xeploai = "Yếu"
		}

		result := initialize.DB.Model(&model.SinhVienDiemRenLuyen{}).Where("ma_sinh_vien_diem_ren_luyen = ?", sinhviendiemrenluyenxuly[0]).Updates(model.SinhVienDiemRenLuyen{
			TongDiemTruongKhoa: datainput.TongDiem,
			XepLoaiTruongKhoa:  xeploai,
		})
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Update tongdiem truongkhoa sinhviendiemrenluyen failed",
			})
			return
		}

		c.JSON(200, gin.H{
			"message": "Update diemtruongkhoadanhgia successful",
		})
	case "chuyenviendaotao":
		// Update diemchuyenviendaotao for each tieuchi
		for _, tieuchi := range datainput.Danhsachtieuchi {
			result := initialize.DB.Model(&model.SinhVienDiemRenLuyenChiTiet{}).Where("ma_sinh_vien_diem_ren_luyen_chi_tiet = ?", tieuchi.MaSinhVienDiemRenLuyenChiTiet).Updates(model.SinhVienDiemRenLuyenChiTiet{
				DiemChuyenVienDaoTao: tieuchi.DiemChuyenVienDaoTao,
			})
			if result.Error != nil {
				c.JSON(400, gin.H{
					"error": "Update diemchuyenviendaotao failed",
				})
				return
			}
		}

		// Update tongdiemchuyenviendaotao in SinhVienDiemRenLuyen
		var sinhviendiemrenluyenxuly []string
		sinhviendiemrenluyenxuly = strings.Split(datainput.Danhsachtieuchi[0].MaSinhVienDiemRenLuyenChiTiet, "+")
		var xeploai string
		if datainput.TongDiem > 90 {
			xeploai = "Xuất sắc"
		} else if datainput.TongDiem > 80 {
			xeploai = "Giỏi"
		} else if datainput.TongDiem > 65 {
			xeploai = "Khá"
		} else if datainput.TongDiem > 50 {
			xeploai = "Trung bình"
		} else {
			xeploai = "Yếu"
		}

		result := initialize.DB.Model(&model.SinhVienDiemRenLuyen{}).Where("ma_sinh_vien_diem_ren_luyen = ?", sinhviendiemrenluyenxuly[0]).Updates(model.SinhVienDiemRenLuyen{
			TongDiemChuyenVienDaoTao: datainput.TongDiem,
			XepLoaiChuyenVienDaoTao:  xeploai,
		})
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Update tongdiem chuyenviendaotao sinhviendiemrenluyen failed",
			})
			return
		}

		c.JSON(200, gin.H{
			"message": "Update diemchuyenviendaotao successful",
		})
	}
}
