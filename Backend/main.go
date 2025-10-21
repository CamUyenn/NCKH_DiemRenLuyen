package main

import (
	"Backend/controller"
	"Backend/controller/bangdiem"
	"Backend/controller/giangvien"
	"Backend/controller/hocky"
	"Backend/controller/login"
	"Backend/controller/lopsinhhoat"
	"Backend/controller/sinhvien"
	"Backend/controller/tieuchi"
	"Backend/initialize"
	"Backend/migrate"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func init() {
	initialize.LoadEnv()
	initialize.ConnectDB()
}

func main() {
	migrate.MigrateData()

	router := gin.Default()
	// Config CORS
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"}, // FE dev server
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	router.POST("/api/login", controller.Login)
	router.POST("/api/taotieuchi", tieuchi.TaoTieuChi)
	router.POST("/api/taobangdiem", bangdiem.TaoBangDiem)
	router.POST("/api/saochepbangdiem", bangdiem.SaoChepBangDiem)
	router.POST("/api/suatieuchi", tieuchi.SuaTieuChi)
	router.POST("/api/phatbangdiem", bangdiem.PhatBangDiem)
	router.POST("/api/sauloginsinhvien", login.SauLoginSinhVien)
	router.POST("/api/doihocky", hocky.DoiHocKy)
	router.POST("/api/chamdiem", tieuchi.ChamDiem)
	router.POST("/api/thaydoitrangthai", bangdiem.ThayDoiTrangThai)
	router.POST("/api/saochepdiem", tieuchi.SaoChepDiem)
	router.POST("/api/saocheptoanbodiem", tieuchi.SaoChepToanBoDiem)
	router.POST("/api/saulogingiangvien", login.SauLoginGiangVien)
	router.POST("/api/taosinhvien", sinhvien.TaoSinhVien)
	router.POST("/api/suasinhvien", sinhvien.SuaSinhVien)
	router.POST("/api/taogiangvien", giangvien.TaoGiangVien)
	router.POST("/api/suagiangvien", giangvien.SuaGiangVien)
	router.POST("/api/taolopsinhhoat", lopsinhhoat.TaoLopSinhHoat)
	router.POST("/api/sualopsinhhoat", lopsinhhoat.SuaLopSinhHoat)
	router.POST("/api/taolopsinhhoathocky", lopsinhhoat.TaoLopSinhHoatHocKy)
	router.POST("/api/taolopsinhhoatsinhvien", lopsinhhoat.TaoLopSinhHoatSinhVien)

	router.GET("/api/xembangdiem", bangdiem.XemBangDiem)
	router.GET("/api/xemtieuchi/:mabangdiem", tieuchi.XemTieuChi)
	router.GET("/api/xemhocky", hocky.XemHocKy)
	router.GET("/api/xemdanhsachhocky/:manguoidung/:type", hocky.XemDanhSachHocKy)
	router.GET("/api/xemdanhsachbangdiemsinhvien/:malopsinhhoat/:mahocky", bangdiem.XemDanhSachBangDiemSinhVien)
	router.GET("/api/xemtieuchivadiemdacham/:mabangdiemcham", tieuchi.XemTieuChiVaDiemDaCham)
	router.GET("/api/xemdiemdachamquacacnam/:masinhvien", bangdiem.XemDiemDaChamQuaCacNam)
	router.GET("/api/xemandanhsachbangdiemsinhvientheolop/:makhoa/:mahocky", bangdiem.XemDanhSachBangDiemSinhVienTheoLop)
	router.GET("/api/xemsinhvien/:masinhvien", sinhvien.XemSinhVien)
	router.GET("/api/xemtatcasinhvien", sinhvien.XemTatCaSinhVien)
	router.GET("/api/xemgiangvien/:magiangvien", giangvien.XemGiangVien)
	router.GET("/api/xemtatcagiangvien", giangvien.XemTatCaGiangVien)
	router.GET("/api/xemlopsinhhoat/:malopsinhhoat", lopsinhhoat.XemLopSinhHoat)
	router.GET("/api/xemtatcalopsinhhoat", lopsinhhoat.XemTatCaLopSinhHoat)

	router.DELETE("/api/xoahocky/:mahocky", hocky.XoaHocKy)
	router.DELETE("/api/xoabangdiem/:mabangdiem", bangdiem.XoaBangDiem)
	router.DELETE("/api/xoasinhvien/:masinhvien", sinhvien.XoaSinhVien)
	router.DELETE("/api/xoagiangvien/:magiangvien", giangvien.XoaGiangVien)
	router.DELETE("/api/xoalopsinhhoat/:malopsinhhoat", lopsinhhoat.XoaLopSinhHoat)

	router.Run()
}
