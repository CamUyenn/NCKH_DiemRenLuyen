package bangdiem

import (
	"Backend/initialize"
	"Backend/model"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

func XemBangDiem(c *gin.Context) {
	var bangdiem []model.BangDiem
	// Retrieve bangdiem data from the database
	result := initialize.DB.Find(&bangdiem)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Failed to retrieve bangdiem",
		})
		return
	}

	// Process the bangdiem code
	type Bangdiemoutput struct {
		Mabangdiem string `json:"ma_bang_diem"`
		Hocky      int    `json:"hoc_ky"`
		Namhoc     string `json:"nam_hoc"`
	}
	var count int64
	result = initialize.DB.Model(&model.BangDiem{}).Count(&count)
	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Failed to count bangdiem",
		})
		return
	}

	// Create output bangdiemlist
	bangdiemoutputlist := make([]Bangdiemoutput, count)
	run := 0
	for _, bangdiemxuly := range bangdiem {
		bangdiemoutputlist[run].Mabangdiem = bangdiemxuly.MaBangDiem

		latcat := strings.Split(bangdiemxuly.MaBangDiem, "_")

		latcat = strings.Split(latcat[0], ".")
		bangdiemoutputlist[run].Hocky, _ = strconv.Atoi(latcat[1])

		bangdiemoutputlist[run].Namhoc = latcat[0]
		run += 1
	}

	c.JSON(200, bangdiemoutputlist)
}
