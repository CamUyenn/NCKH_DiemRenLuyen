package bangdiem

import (
	"Backend/controller/hocky"
	"Backend/initialize"
	"Backend/model"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

func TaoBangDiem(c *gin.Context) {
	var hockycheck model.HocKy
	var bangdiemcheck model.BangDiem

	// Fetch mahocky from JSON
	if err := c.ShouldBindJSON(&hockycheck); err != nil {
		c.JSON(400, gin.H{
			"error": "Fetch mahocky from JSON failed",
		})
		return
	}

	// Check if hocky already exists
	var count int64
	result := initialize.DB.Model(&model.HocKy{}).Where("ma_hoc_ky = ?", hockycheck.MaHocKy).Count(&count)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Count hocky in database failed",
		})
		return
	}

	if count == 0 {
		// Create HocKy
		hocky.TaoHocKy(c, hockycheck)
	}
	// Check if BangDiem already exists
	result = initialize.DB.Model(&model.BangDiem{}).Where("ma_hoc_ky_tham_chieu = ?", hockycheck.MaHocKy).Count(&count)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Count bangdiem in database failed",
		})
		return
	}

	// Check the count of existing BangDiem in the HocKy
	if count < 11 {
		// Create BangDiem
		bangdiemcheck.MaBangDiem = hockycheck.MaHocKy + "_BD" + strconv.FormatInt(count, 10)
		bangdiemcheck.MaHocKyThamChieu = hockycheck.MaHocKy
		bangdiemcheck.NgayTao = time.Now()
		bangdiemcheck.ThoiHanNop = time.Now().AddDate(0, 1, 0)

		result = initialize.DB.Create(&bangdiemcheck)
		if result.Error != nil {
			c.JSON(400, gin.H{
				"error": "Create bangdiem failed",
			})
			return
		} else {
			c.JSON(200, gin.H{
				"message": "Create bangdiem successfully",
			})
			return
		}
	} else {
		c.JSON(400, gin.H{
			"error": "Bangdiem limit create for this hocky",
		})
		return
	}
}
