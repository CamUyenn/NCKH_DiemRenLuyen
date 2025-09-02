package migrate

import (
	"Backend/initialize"
	"Backend/model"
)

func MigrateData() {
	initialize.DB.AutoMigrate(&model.SinhVien{})
}
