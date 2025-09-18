package main

import (
	"Backend/controller"
	"Backend/controller/tieuchi"
	"Backend/initialize"
	"Backend/migrate"

	"github.com/gin-gonic/gin"
)

func init() {
	initialize.LoadEnv()
	initialize.ConnectDB()
}

func main() {
	migrate.MigrateData()

	router := gin.Default()

	router.POST("/api/login", controller.Login)
	router.POST("/api/tieuchi", tieuchi.TaoTieuChi)

	router.Run()
}
