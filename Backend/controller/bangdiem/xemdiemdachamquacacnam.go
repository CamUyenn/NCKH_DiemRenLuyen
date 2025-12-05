package bangdiem

import (
	"Backend/initialize"
	"Backend/model"

	"github.com/gin-gonic/gin"
)

func XemDiemDaChamQuaCacNam(c *gin.Context) {
	masinhvien := c.Param("masinhvien")

	type KetQua struct {
		Hocky        string `json:"hocky"`
		Lopsinhhoat  string `json:"lopsinhhoat"`
		Giangvien    string `json:"giangvien"`
		Mabangdiem   string `json:"mabangdiem"`
		Diemsinhvien int    `json:"diemsinhvien"`
		Xeploai      string `json:"xeploai"`
	}

	var ketqua []KetQua

	result := initialize.DB.Model(&model.SinhVienDiemRenLuyen{}).
		Joins(`
			JOIN LopSinhHoatSinhVien 
			ON LopSinhHoatSinhVien.ma_sinh_vien_tham_chieu = SinhVienDiemRenLuyen.ma_sinh_vien_tham_chieu
		`).
		Joins(`
			JOIN LopSinhHoatHocKy 
			ON LopSinhHoatHocKy.ma_lop_sinh_hoat_tham_chieu = LopSinhHoatSinhVien.ma_lop_sinh_hoat_tham_chieu
			AND LopSinhHoatHocKy.ma_hoc_ky_tham_chieu = SinhVienDiemRenLuyen.ma_hoc_ky_tham_chieu
		`).
		Joins(`
			JOIN LopSinhHoat 
			ON LopSinhHoat.ma_lop_sinh_hoat = LopSinhHoatHocKy.ma_lop_sinh_hoat_tham_chieu
		`).
		Joins(`
			JOIN GiangVien 
			ON GiangVien.ma_giang_vien = LopSinhHoatHocKy.ma_giang_vien_co_van
		`).
		Select(`
			SinhVienDiemRenLuyen.ma_hoc_ky_tham_chieu AS hocky,
			LopSinhHoat.ten_lop AS lopsinhhoat,
			CONCAT(GiangVien.ho_dem, ' ', GiangVien.ten) AS giangvien,
			SinhVienDiemRenLuyen.ma_bang_diem_tham_chieu AS mabangdiem,
			SinhVienDiemRenLuyen.tong_diem_chuyen_vien_dao_tao AS diemsinhvien,
			SinhVienDiemRenLuyen.xep_loai_chuyen_vien_dao_tao AS xeploai
		`).
		Where(`
			SinhVienDiemRenLuyen.ma_sinh_vien_tham_chieu = ? 
			AND SinhVienDiemRenLuyen.trang_thai = N'Chuyên Viên Đã Chấm'
		`, masinhvien).
		Group(`
			SinhVienDiemRenLuyen.ma_hoc_ky_tham_chieu,
			LopSinhHoat.ten_lop,
			GiangVien.ho_dem, GiangVien.ten,
			SinhVienDiemRenLuyen.ma_bang_diem_tham_chieu,
			SinhVienDiemRenLuyen.tong_diem_chuyen_vien_dao_tao,
			SinhVienDiemRenLuyen.xep_loai_chuyen_vien_dao_tao
		`).
		Order("SinhVienDiemRenLuyen.ma_hoc_ky_tham_chieu ASC").
		Find(&ketqua)

	if result.Error != nil {
		c.JSON(400, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(200, gin.H{"data": ketqua})
}
