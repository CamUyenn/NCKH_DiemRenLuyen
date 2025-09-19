package main

import (
	"Backend/controller"
	"Backend/controller/bangdiem"
	"Backend/controller/hocky"
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
	router.DELETE("/api/xoatieuchi/:id", tieuchi.XoaTieuChi)
	router.DELETE("/api/xoabangdiem/:id", bangdiem.XoaBangDiem)
	router.DELETE("/api/xoahocky/:id", hocky.XoaHocKy)
	router.GET("/api/xembangdiem", bangdiem.XemBangDiem)

	router.Run()
}
