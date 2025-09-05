package main

import (
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

	router.Run()
}
