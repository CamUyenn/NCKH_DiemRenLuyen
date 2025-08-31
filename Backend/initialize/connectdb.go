package initialize

import (
	"log"
	"os"

	"gorm.io/driver/sqlserver"
	"gorm.io/gorm"
)

var db *gorm.DB

func ConnectDB() {
	var err error
	dsn := os.Getenv("DB_URL")
	db, err = gorm.Open(sqlserver.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatal("Connect to database failed")
	}
}
