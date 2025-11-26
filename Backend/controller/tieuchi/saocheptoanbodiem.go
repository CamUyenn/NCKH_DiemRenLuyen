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
		// Copy diemsinhviendanhgia to diemloptruongdanhgia
		result = initialize.DB.Exec("UPDATE SinhVienDiemRenLuyenChiTiet SET SinhVienDiemRenLuyenChiTiet.diem_lop_truong_danh_gia = SinhVienDiemRenLuyenChiTiet.diem_sinh_vien_danh_gia FROM SinhVienDiemRenLuyen JOIN SinhVienDiemRenLuyenChiTiet ON SinhVienDiemRenLuyen.ma_sinh_vien_diem_ren_luyen = SinhVienDiemRenLuyenChiTiet.ma_sinh_vien_diem_ren_luyen_tham_chieu WHERE SinhVienDiemRenLuyen.ma_sinh_vien_tham_chieu IN ? AND SinhVienDiemRenLuyen.ma_hoc_ky_tham_chieu = ? AND SinhVienDiemRenLuyen.trang_thai = N'Sinh Viên Đã Chấm'", listmasinhvien, datainput.Mahocky)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Failed to copy diemloptruongdanhgia",
			})
			return
		}

		// Copy tongdiemsinhvien to tongdiemloptruong and xeploaisinhvien to xeploailoptruong
		result = initialize.DB.Exec("UPDATE SinhVienDiemRenLuyen SET tong_diem_lop_truong = tong_diem_sinh_vien, xep_loai_lop_truong = xep_loai_sinh_vien WHERE ma_sinh_vien_tham_chieu IN ? AND ma_hoc_ky_tham_chieu = ? AND trang_thai = N'Sinh Viên Đã Chấm'", listmasinhvien, datainput.Mahocky)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Failed to copy diemloptruongdanhgia to SinhVienDiemRenLuyen",
			})
			return
		}

		c.JSON(200, gin.H{
			"message": "Copy diemloptruongdanhgia successful",
		})
		return
	case "giangvien":
		// Copy diemloptruongdanhgia to diemgiangviendanhgia
		result = initialize.DB.Exec("UPDATE SinhVienDiemRenLuyenChiTiet SET SinhVienDiemRenLuyenChiTiet.diem_giang_vien_danh_gia = SinhVienDiemRenLuyenChiTiet.diem_lop_truong_danh_gia FROM SinhVienDiemRenLuyen JOIN SinhVienDiemRenLuyenChiTiet ON SinhVienDiemRenLuyen.ma_sinh_vien_diem_ren_luyen = SinhVienDiemRenLuyenChiTiet.ma_sinh_vien_diem_ren_luyen_tham_chieu WHERE SinhVienDiemRenLuyen.ma_sinh_vien_tham_chieu IN ? AND SinhVienDiemRenLuyen.ma_hoc_ky_tham_chieu = ? AND SinhVienDiemRenLuyen.trang_thai = N'Lớp Trưởng Đã Chấm'", listmasinhvien, datainput.Mahocky)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Failed to copy diemgiangviendanhgia",
			})
			return
		}

		// Copy tongdiemloptruong to tongdiemcovan and xeploailoptruong to xeploaicovan
		result = initialize.DB.Exec("UPDATE SinhVienDiemRenLuyen SET tong_diem_co_van = tong_diem_lop_truong, xep_loai_co_van = xep_loai_lop_truong WHERE ma_sinh_vien_tham_chieu IN ? AND ma_hoc_ky_tham_chieu = ? AND trang_thai = N'Lớp Trưởng Đã Chấm'", listmasinhvien, datainput.Mahocky)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Failed to copy diemgiangviendanhgia to SinhVienDiemRenLuyen",
			})
			return
		}

		c.JSON(200, gin.H{
			"message": "Copy diemgiangviendanhgia successful",
		})
		return
	case "truongkhoa":
		// Copy diemgiangviendanhgia to diemtruongkhoadanhgia
		result = initialize.DB.Exec("UPDATE SinhVienDiemRenLuyenChiTiet SET SinhVienDiemRenLuyenChiTiet.diem_truong_khoa_danh_gia = SinhVienDiemRenLuyenChiTiet.diem_giang_vien_danh_gia FROM SinhVienDiemRenLuyen JOIN SinhVienDiemRenLuyenChiTiet ON SinhVienDiemRenLuyen.ma_sinh_vien_diem_ren_luyen = SinhVienDiemRenLuyenChiTiet.ma_sinh_vien_diem_ren_luyen_tham_chieu WHERE SinhVienDiemRenLuyen.ma_sinh_vien_tham_chieu IN ? AND SinhVienDiemRenLuyen.ma_hoc_ky_tham_chieu = ? AND SinhVienDiemRenLuyen.trang_thai = N'Giảng Viên Đã Chấm'", listmasinhvien, datainput.Mahocky)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Failed to copy diemtruongkhoadanhgia",
			})
			return
		}

		// Copy tongdiemcovan to tongdiemtruongkhoa and xeploaicovan to xeploaitruongkhoa
		result = initialize.DB.Exec("UPDATE SinhVienDiemRenLuyen SET tong_diem_truong_khoa = tong_diem_co_van, xep_loai_truong_khoa = xep_loai_co_van WHERE ma_sinh_vien_tham_chieu IN ? AND ma_hoc_ky_tham_chieu = ? AND trang_thai = N'Giảng Viên Đã Chấm'", listmasinhvien, datainput.Mahocky)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Failed to copy diemtruongkhoadanhgia to SinhVienDiemRenLuyen",
			})
			return
		}

		c.JSON(200, gin.H{
			"message": "Copy diemtruongkhoadanhgia successful",
		})
		return
	case "chuyenviencovan":
		// Copy diemtruongkhoadanhgia to diemchuyenviencovan
		result = initialize.DB.Exec("UPDATE SinhVienDiemRenLuyenChiTiet SET SinhVienDiemRenLuyenChiTiet.diem_chuyen_vien_co_van = SinhVienDiemRenLuyenChiTiet.diem_truong_khoa_danh_gia FROM SinhVienDiemRenLuyen JOIN SinhVienDiemRenLuyenChiTiet ON SinhVienDiemRenLuyen.ma_sinh_vien_diem_ren_luyen = SinhVienDiemRenLuyenChiTiet.ma_sinh_vien_diem_ren_luyen_tham_chieu WHERE SinhVienDiemRenLuyen.ma_sinh_vien_tham_chieu IN ? AND SinhVienDiemRenLuyen.ma_hoc_ky_tham_chieu = ? AND SinhVienDiemRenLuyen.trang_thai = N'Trưởng Khoa Đã Duyệt'", listmasinhvien, datainput.Mahocky)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Failed to copy diemchuyenviencovan",
			})
			return
		}

		// Copy tongdiemtruongkhoa to tongdiemchuyenviendaotao and xeploaitruongkhoa to xeploaichuyenviendaotao
		result = initialize.DB.Exec("UPDATE SinhVienDiemRenLuyen SET tong_diem_chuyen_vien_dao_tao = tong_diem_truong_khoa, xep_loai_chuyen_vien_dao_tao = xep_loai_truong_khoa WHERE ma_sinh_vien_tham_chieu IN ? AND ma_hoc_ky_tham_chieu = ? AND trang_thai = N'Trưởng Khoa Đã Duyệt'", listmasinhvien, datainput.Mahocky)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Failed to copy diemchuyenviencovan to SinhVienDiemRenLuyen",
			})
			return
		}

		c.JSON(200, gin.H{
			"message": "Copy diemchuyenviencovan successful",
		})
		return
	}
}
