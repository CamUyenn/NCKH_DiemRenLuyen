package bangdiem

import (
	"Backend/initialize"
	"Backend/model"

	"github.com/gin-gonic/gin"
)

func XemDanhSachBangDiemSinhVien(c *gin.Context) {
	malopsinhhoat := c.Param("malopsinhhoat")
	mahocky := c.Param("mahocky")

	// Query danhsachmasinhvien
	var danhsachmasinhvien []string
	result := initialize.DB.Model(model.LopSinhHoatSinhVien{}).
		Select("ma_sinh_vien_tham_chieu").
		Where("ma_hoc_ky_tham_chieu = ? AND ma_lop_sinh_hoat_tham_chieu = ?", mahocky, malopsinhhoat).
		Find(&danhsachmasinhvien)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Failed query danhsachmasinhvien",
		})
		return
	}

	// Query thongtinsinhvien
	type Sinhvienxuly struct {
		MaSinhVien string `json:"ma_sinh_vien"`
		HoDem      string `json:"ho_dem"`
		Ten        string `json:"ten"`
	}
	var danhsachsinhvien []Sinhvienxuly
	result = initialize.DB.Model(model.SinhVien{}).
		Select("ma_sinh_vien", "ho_dem", "ten").
		Where("ma_sinh_vien IN ?", danhsachmasinhvien).
		Find(&danhsachsinhvien)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Failed query thongtinsinhvien",
		})
		return
	}

	sinhvienmap := make(map[string]Sinhvienxuly)
	for _, sv := range danhsachsinhvien {
		sinhvienmap[sv.MaSinhVien] = sv
	}

	// Query diemrenluyensinhvien
	type Diemsinhvien struct {
		MaSinhVien               string `json:"ma_sinh_vien"`
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
	var danhsachdiem []Diemsinhvien
	result = initialize.DB.Model(model.SinhVienDiemRenLuyen{}).
		Select(`ma_sinh_vien_tham_chieu AS ma_sinh_vien,
				ma_sinh_vien_diem_ren_luyen,
				trang_thai,
				xep_loai_sinh_vien,
				tong_diem_sinh_vien,
				xep_loai_lop_truong,
				tong_diem_lop_truong,
				xep_loai_co_van,
				tong_diem_co_van,
				xep_loai_truong_khoa,
				tong_diem_truong_khoa,
				xep_loai_chuyen_vien_dao_tao,
				tong_diem_chuyen_vien_dao_tao`).
		Where("ma_sinh_vien_tham_chieu IN ? AND ma_hoc_ky_tham_chieu = ?", danhsachmasinhvien, mahocky).
		Find(&danhsachdiem)

	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Failed query diemrenluyensinhvien",
		})
		return
	}

	// Create output data
	type Thongtintrave struct {
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
	var trangthaitong string

	listthongtin := make([]Thongtintrave, 0, len(danhsachdiem))
	for _, d := range danhsachdiem {
		sv := sinhvienmap[d.MaSinhVien]
		listthongtin = append(listthongtin, Thongtintrave{
			MaSinhVien:               d.MaSinhVien,
			HoDem:                    sv.HoDem,
			Ten:                      sv.Ten,
			MaSinhVienDiemRenLuyen:   d.MaSinhVienDiemRenLuyen,
			TrangThai:                d.TrangThai,
			XepLoaiSinhVien:          d.XepLoaiSinhVien,
			TongDiemSinhVien:         d.TongDiemSinhVien,
			XepLoaiLopTruong:         d.XepLoaiLopTruong,
			TongDiemLopTruong:        d.TongDiemLopTruong,
			XepLoaiCoVan:             d.XepLoaiCoVan,
			TongDiemCoVan:            d.TongDiemCoVan,
			XepLoaiTruongKhoa:        d.XepLoaiTruongKhoa,
			TongDiemTruongKhoa:       d.TongDiemTruongKhoa,
			XepLoaiChuyenVienDaoTao:  d.XepLoaiChuyenVienDaoTao,
			TongDiemChuyenVienDaoTao: d.TongDiemChuyenVienDaoTao,
		})
		if d.TrangThai == "Đã Phát" || d.TrangThai == "Sinh Viên Đã Chấm" {
			trangthaitong = "Lớp Trưởng Chưa Chấm"
		} else {
			trangthaitong = "Lớp Trưởng Đã Chấm"
		}
	}

	c.JSON(200, gin.H{
		"danh_sach_bang_diem_sinh_vien": listthongtin,
		"trang_thai_tong":               trangthaitong,
	})
}
