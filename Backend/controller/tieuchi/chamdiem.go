package tieuchi

import (
	"Backend/initialize"
	"Backend/model"

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
		c.JSON(200, gin.H{
			"message": "Update diemsinhviendanhgia successful",
		})
	case "loptruong":
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
		c.JSON(200, gin.H{
			"message": "Update diemloptruongdanhgia successful",
		})
	case "giangvien":
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
		c.JSON(200, gin.H{
			"message": "Update diemgiangviendanhgia successful",
		})
	case "truongkhoa":
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
		c.JSON(200, gin.H{
			"message": "Update diemtruongkhoadanhgia successful",
		})
	case "chuyenviendaotao":
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
		c.JSON(200, gin.H{
			"message": "Update diemchuyenviendaotao successful",
		})
	}
}
