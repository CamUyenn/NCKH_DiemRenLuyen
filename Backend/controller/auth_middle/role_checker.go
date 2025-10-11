package auth_middle

import (
	"Backend/initialize"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Hàm handler cho endpoint /session/select-hocky
func SelectHocKy(c *gin.Context) {
	type req struct {
		HocKyID string `json:"hoc_ky_id"`
	}
	var in req
	if err := c.ShouldBindJSON(&in); err != nil || in.HocKyID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "hoc_ky_id required"})
		return
	}

	userID := c.GetString("user_id")
	baseType := c.GetString("user_type")

	newType := CheckRoleBySemester(userID, baseType, in.HocKyID)
	token, err := MintAccessWithHocKy(userID, newType, in.HocKyID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "cannot mint token", "detail": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"access_token": token,
		"hoc_ky_id":    in.HocKyID,
		"user_type":    newType,
	})
}

// Hàm xác định user_type thực tế trong học kỳ
func CheckRoleBySemester(userID string, baseType string, hocKyID string) string {
	newType := baseType

	// Nếu là admin thì bỏ qua kiểm tra, luôn là admin
	if baseType == "admin" {
		return "admin"
	}

	switch baseType {
	case "sinhvien":
		var cnt int64
		initialize.DB.Raw(`
			SELECT COUNT(*) FROM LopSinhHoatHocKy 
			WHERE ma_hoc_ky_tham_chieu = ? AND ma_lop_truong = ?
		`, hocKyID, userID).Scan(&cnt)
		if cnt > 0 {
			newType = "loptruong"
		} else {
			newType = "sinhvien"
		}

	case "giangvien", "admin":
		var cnt int64
		initialize.DB.Raw(`
			SELECT COUNT(*) FROM LopSinhHoatHocKy 
			WHERE ma_hoc_ky_tham_chieu = ? AND ma_truong_khoa = ?
		`, hocKyID, userID).Scan(&cnt)
		if cnt > 0 {
			newType = "truongkhoa"
			break
		}

		initialize.DB.Raw(`
			SELECT COUNT(*) FROM LopSinhHoatHocKy 
			WHERE ma_hoc_ky_tham_chieu = ? AND ma_chuyen_vien_dao_tao = ?
		`, hocKyID, userID).Scan(&cnt)
		if cnt > 0 {
			newType = "chuyenviendaotao"
		} else {
			newType = "giangvien"
		}
	}

	return newType
}
