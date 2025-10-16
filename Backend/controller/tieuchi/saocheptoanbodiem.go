package tieuchi

import (
	"Backend/initialize"
	"Backend/model"

	"github.com/gin-gonic/gin"
)

func SaoChepToanBoDiem(c *gin.Context) {
	// Fetch input data
	type DataInput struct {
		Malopsinhhoat []string `json:"malopsinhhoat"`
		Mahocky       string   `json:"ma_hoc_ky"`
		Type          string   `json:"type"`
	}
	var datainput DataInput
	if err := c.ShouldBindJSON(&datainput); err != nil {
		c.JSON(400, gin.H{
			"error": "Invalid input",
		})
		return
	}
	// Find list masinhvien by list malopsinhhoat and mahocky
	var listmasinhvien []string
	result := initialize.DB.Model(&model.LopSinhHoatSinhVien{}).Select("ma_sinh_vien_tham_chieu").Where("ma_lop_sinh_hoat_tham_chieu IN ? AND ma_hoc_ky_tham_chieu = ?", datainput.Malopsinhhoat, datainput.Mahocky).Find(&listmasinhvien)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Find listmasinhvien failed",
		})
		return
	}

	switch datainput.Type {
	case "loptruong":
		result = initialize.DB.Exec("UPDATE SinhVienDiemRenLuyenChiTiet SET SinhVienDiemRenLuyenChiTiet.diem_lop_truong_danh_gia = SinhVienDiemRenLuyenChiTiet.diem_sinh_vien_danh_gia FROM SinhVienDiemRenLuyen JOIN SinhVienDiemRenLuyenChiTiet ON SinhVienDiemRenLuyen.ma_sinh_vien_diem_ren_luyen = SinhVienDiemRenLuyenChiTiet.ma_sinh_vien_diem_ren_luyen_tham_chieu WHERE SinhVienDiemRenLuyen.ma_sinh_vien_tham_chieu IN ? AND SinhVienDiemRenLuyen.ma_hoc_ky_tham_chieu = ? AND SinhVienDiemRenLuyen.trang_thai = N'Sinh Viên Đã Chấm'", listmasinhvien, datainput.Mahocky)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Failed to copy diemloptruongdanhgia",
			})
			return
		}
		c.JSON(200, gin.H{"message": "Copy diemloptruongdanhgia successful"})
		return
	case "giangvien":
		result = initialize.DB.Exec("UPDATE SinhVienDiemRenLuyenChiTiet SET SinhVienDiemRenLuyenChiTiet.diem_giang_vien_danh_gia = SinhVienDiemRenLuyenChiTiet.diem_lop_truong_danh_gia FROM SinhVienDiemRenLuyen JOIN SinhVienDiemRenLuyenChiTiet ON SinhVienDiemRenLuyen.ma_sinh_vien_diem_ren_luyen = SinhVienDiemRenLuyenChiTiet.ma_sinh_vien_diem_ren_luyen_tham_chieu WHERE SinhVienDiemRenLuyen.ma_sinh_vien_tham_chieu IN ? AND SinhVienDiemRenLuyen.ma_hoc_ky_tham_chieu = ? AND SinhVienDiemRenLuyen.trang_thai = N'Sinh Viên Đã Chấm'", listmasinhvien, datainput.Mahocky)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Failed to copy diemgiangviendanhgia",
			})
			return
		}
		c.JSON(200, gin.H{"message": "Copy diemgiangviendanhgia successful"})
		return
	case "truongkhoa":
		result = initialize.DB.Exec("UPDATE SinhVienDiemRenLuyenChiTiet SET SinhVienDiemRenLuyenChiTiet.diem_truong_khoa_danh_gia = SinhVienDiemRenLuyenChiTiet.diem_giang_vien_danh_gia FROM SinhVienDiemRenLuyen JOIN SinhVienDiemRenLuyenChiTiet ON SinhVienDiemRenLuyen.ma_sinh_vien_diem_ren_luyen = SinhVienDiemRenLuyenChiTiet.ma_sinh_vien_diem_ren_luyen_tham_chieu WHERE SinhVienDiemRenLuyen.ma_sinh_vien_tham_chieu IN ? AND SinhVienDiemRenLuyen.ma_hoc_ky_tham_chieu = ? AND SinhVienDiemRenLuyen.trang_thai = N'Sinh Viên Đã Chấm'", listmasinhvien, datainput.Mahocky)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Failed to copy diemtruongkhoadanhgia",
			})
			return
		}
		c.JSON(200, gin.H{"message": "Copy diemtruongkhoadanhgia successful"})
		return
	case "chuyenviencovan":
		result = initialize.DB.Exec("UPDATE SinhVienDiemRenLuyenChiTiet SET SinhVienDiemRenLuyenChiTiet.diem_chuyen_vien_co_van = SinhVienDiemRenLuyenChiTiet.diem_truong_khoa_danh_gia FROM SinhVienDiemRenLuyen JOIN SinhVienDiemRenLuyenChiTiet ON SinhVienDiemRenLuyen.ma_sinh_vien_diem_ren_luyen = SinhVienDiemRenLuyenChiTiet.ma_sinh_vien_diem_ren_luyen_tham_chieu WHERE SinhVienDiemRenLuyen.ma_sinh_vien_tham_chieu IN ? AND SinhVienDiemRenLuyen.ma_hoc_ky_tham_chieu = ? AND SinhVienDiemRenLuyen.trang_thai = N'Sinh Viên Đã Chấm'", listmasinhvien, datainput.Mahocky)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Failed to copy diemchuyenviencovan",
			})
			return
		}
		c.JSON(200, gin.H{"message": "Copy diemchuyenviencovan successful"})
		return
	}
}
