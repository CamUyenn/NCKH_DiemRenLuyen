package bangdiem

import (
	"Backend/initialize"
	"Backend/model"

	"github.com/gin-gonic/gin"
)

func XemDanhSachBangDiemSinhVien(c *gin.Context) {
	malopsinhhoat := c.Param("malopsinhhoat")
	mahocky := c.Param("mahocky")

	type Listthongtintrave struct {
		MaSinhVien               string `json:"ma_sinh_vien"`
		HoDem                    string `json:"ho_dem"`
		Ten                      string `json:"ten"`
		MaSinhVienDiemRenLuyen   string `json:"ma_sinh_vien_diem_ren_luyen"`
		TrangThai                string `json:"trang_thai"`
		XepLoaiSinhVien          string `json:"xep_loai_sinh_vien"`
		TongDiemSinhVien         int    `json:"tong_diem_sinh_vien"`
		XepLoaiLopTruong         string `json:"xep_loai_lop_truong"`
		TongDiemLopTruong        int    `json:"tong_diem_lop_truong"`
		XepLoaiCoVan             string `json:"xep_loai_co_van"`
		TongDiemCoVan            int    `json:"tong_diem_co_van"`
		XepLoaiTruongKhoa        string `json:"xep_loai_truong_khoa"`
		TongDiemTruongKhoa       int    `json:"tong_diem_truong_khoa"`
		XepLoaiChuyenVienDaoTao  string `json:"xep_loai_chuyen_vien_dao_tao"`
		TongDiemChuyenVienDaoTao int    `json:"tong_diem_chuyen_vien_dao_tao"`
	}

	var listthongtintrave []Listthongtintrave
	result := initialize.DB.Model(model.LopSinhHoatSinhVien{}).
		Joins("JOIN SinhVien ON LopSinhHoatSinhVien.ma_sinh_vien_tham_chieu = SinhVien.ma_sinh_vien").
		Joins("JOIN SinhVienDiemRenLuyen ON SinhVien.ma_sinh_vien = SinhVienDiemRenLuyen.ma_sinh_vien_tham_chieu").
		Select(`SinhVien.ma_sinh_vien,SinhVien.ho_dem,SinhVien.ten,SinhVienDiemRenLuyen.ma_sinh_vien_diem_ren_luyen,SinhVienDiemRenLuyen.trang_thai,SinhVienDiemRenLuyen.xep_loai_sinh_vien,SinhVienDiemRenLuyen.tong_diem_sinh_vien,SinhVienDiemRenLuyen.xep_loai_lop_truong,SinhVienDiemRenLuyen.tong_diem_lop_truong,SinhVienDiemRenLuyen.xep_loai_co_van,SinhVienDiemRenLuyen.tong_diem_co_van,SinhVienDiemRenLuyen.xep_loai_truong_khoa,SinhVienDiemRenLuyen.tong_diem_truong_khoa,SinhVienDiemRenLuyen.xep_loai_chuyen_vien_dao_tao,SinhVienDiemRenLuyen.tong_diem_chuyen_vien_dao_tao`).
		Where("LopSinhHoatSinhVien.ma_lop_sinh_hoat_tham_chieu = ? AND LopSinhHoatSinhVien.ma_hoc_ky_tham_chieu = ?", malopsinhhoat, mahocky).Find(&listthongtintrave)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Query listthongtintrave failed",
		})
		return
	}

	c.JSON(200, gin.H{
		"danh_sach_bang_diem_sinh_vien": listthongtintrave,
	})
}
