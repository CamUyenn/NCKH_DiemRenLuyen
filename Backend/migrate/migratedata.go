package migrate

import (
	"Backend/initialize"
	"Backend/model"
)

func MigrateData() {
	initialize.DB.AutoMigrate(&model.HocKy{})
	initialize.DB.AutoMigrate(&model.LopSinhHoat{})
	initialize.DB.AutoMigrate(&model.SinhVien{})
	initialize.DB.AutoMigrate(&model.GiangVien{})
	initialize.DB.AutoMigrate(&model.BangDiem{})
	initialize.DB.AutoMigrate(&model.LopSinhHoatSinhVien{})
	initialize.DB.AutoMigrate(&model.LopSinhHoatHocKy{})
	initialize.DB.AutoMigrate(&model.Admin{})
	initialize.DB.AutoMigrate(&model.SinhVienDiemRenLuyen{})
	initialize.DB.AutoMigrate(&model.BangDiemChiTiet{})
	initialize.DB.AutoMigrate(&model.SinhVienDiemRenLuyenChiTiet{})
}
