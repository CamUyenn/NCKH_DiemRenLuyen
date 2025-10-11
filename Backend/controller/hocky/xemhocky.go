package hocky

import (
	"Backend/initialize"
	"Backend/model"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

func XemHocKy(c *gin.Context) {
	// Retrieve hocky list from database
	var hockyretrive []model.HocKy

	result := initialize.DB.Find(&hockyretrive)
	if result.Error != nil {
		c.JSON(
			400, gin.H{
				"error": "Fail to retrieve hocky list",
			})
	}

	// Get the current year and generate a year list
	year := time.Now().Year()
	var hockycreate []string

	for i := 0; i < 10; i++ {
		yearup := year + i
		yeardown := year - i
		hockycreate = append(hockycreate, strconv.Itoa(yearup)+"-"+strconv.Itoa(yearup+1)+".1", strconv.Itoa(yearup)+"-"+strconv.Itoa(yearup+1)+".2", strconv.Itoa(yeardown-1)+"-"+strconv.Itoa(yeardown)+".1", strconv.Itoa(yeardown-1)+"-"+strconv.Itoa(yeardown)+".2")
	}

	// Remove hocky that already exist
	m := make(map[string]bool)
	for _, hocky := range hockyretrive {
		m[hocky.MaHocKy] = true
	}

	var hockyoutput []string
	for _, v := range hockycreate {
		if !m[v] {
			hockyoutput = append(hockyoutput, v)
		}
	}

	// Return JSON for frontend
	c.JSON(200, gin.H{
		"hocky": hockyoutput,
	})
}
