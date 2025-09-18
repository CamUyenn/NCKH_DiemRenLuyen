package bangdiem

import (
	"Backend/initialize"
	"Backend/model"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func TaoBangDiem(c *gin.Context, mabangdiem string) {
	var bangdiemcheck model.BangDiem
	mahocky := mabangdiem[:len(mabangdiem)-3]

	result := initialize.DB.Where("ma_bang_diem = ?", mabangdiem).First(&bangdiemcheck)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			// Create new BangDiem
			bangdiemcheck.MaBangDiem = mabangdiem
			bangdiemcheck.MaHocKyThamChieu = mahocky
			bangdiemcheck.NgayTao = time.Now()
			bangdiemcheck.ThoiHanNop = time.Now().AddDate(0, 1, 0)

			result = initialize.DB.Create(&bangdiemcheck)
			if result.Error != nil {
				c.JSON(400, gin.H{
					"error": "Tao bang diem khong thanh cong",
				})
				return
			}
			return
		} else {
			c.JSON(400, gin.H{
				"error": "Loi database",
			})
			return
		}
	} else {
		return
	}
}
