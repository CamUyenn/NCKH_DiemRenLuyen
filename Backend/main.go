package main

import (
	"Backend/controller/bangdiem"
	"Backend/controller/hocky"
	"Backend/controller/login"
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

	router.GET("/api/xembangdiem", bangdiem.XemBangDiem)
	router.GET("/api/xemtieuchi/:mabangdiem", tieuchi.XemTieuChi)
	router.GET("/api/xemhocky", hocky.XemHocKy)
	router.GET("/api/xemdanhsachhocky/:manguoidung/:type", hocky.XemDanhSachHocKy)
	router.GET("/api/xemdanhsachbangdiemsinhvien/:malopsinhhoat/:mahocky", bangdiem.XemDanhSachBangDiemSinhVien)
	router.GET("/api/xemtieuchivadiemdacham/:mabangdiemcham", tieuchi.XemTieuChiVaDiemDaCham)

	router.DELETE("/api/xoahocky/:mahocky", hocky.XoaHocKy)
	router.DELETE("/api/xoabangdiem/:mabangdiem", bangdiem.XoaBangDiem)

	router.Run()
}
