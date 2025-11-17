package login

import (
	"Backend/initialize"
	"Backend/model"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// ======================= INPUT / OUTPUT =======================
type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Type     string `json:"type"` // "sv" hoặc "gv"
}

type LoginResponse struct {
	Success     bool   `json:"success"`
	Message     string `json:"message"`
	Type        string `json:"type,omitempty"`
	AccessToken string `json:"access_token,omitempty"`
}

// ======================= SECRET KEY =======================
var JWT_SECRET = []byte(os.Getenv("JWT_SECRET"))

// ======================= TOKEN GENERATOR =======================
// Access Token: sống 30 phút
func generateAccessToken(userID string, userType string) (string, error) {
	claims := jwt.MapClaims{
		"user_id":   userID,
		"user_type": userType, // sinhvien | giangvien | admin (tại thời điểm login)
		"type":      "access",
		"exp":       time.Now().Add(30 * time.Minute).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(JWT_SECRET)
}

// Refresh Token: sống 365 ngày
func generateRefreshToken(userID string, userType string) (string, error) {
	claims := jwt.MapClaims{
		"user_id":   userID,
		"user_type": userType,
		"type":      "refresh",
		"exp":       time.Now().Add(365 * 24 * time.Hour).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(JWT_SECRET)
}

// ======================= LOGIN HANDLER =======================
func Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Dữ liệu không hợp lệ: " + err.Error()})
		return
	}

	// ---- Sinh viên ----
	if req.Type == "sv" {
		var sv model.SinhVien
		query := `SELECT ma_sinh_vien, mat_khau FROM SinhVien WHERE ma_sinh_vien = ? AND mat_khau = ?`
		result := initialize.DB.Raw(query, req.Username, req.Password).Scan(&sv)
		if result.Error != nil || sv.MaSinhVien == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Sai tài khoản hoặc mật khẩu"})
			return
		}

		accessToken, _ := generateAccessToken(sv.MaSinhVien, "sinhvien")
		refreshToken, _ := generateRefreshToken(sv.MaSinhVien, "sinhvien")

		c.SetCookie("refresh_token", refreshToken, 365*24*60*60, "/", "", false, true)

		c.JSON(http.StatusOK, LoginResponse{
			Success:     true,
			Message:     "Đăng nhập thành công",
			Type:        "sinhvien",
			AccessToken: accessToken,
		})
		return
	}

	// ---- Giảng viên ----
	if req.Type == "gv" {
		var gv model.GiangVien
		query := `SELECT ma_giang_vien, mat_khau FROM GiangVien WHERE ma_giang_vien = ? AND mat_khau = ?`
		result := initialize.DB.Raw(query, req.Username, req.Password).Scan(&gv)
		if result.Error != nil || gv.MaGiangVien == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Sai tài khoản hoặc mật khẩu"})
			return
		}

		// Giảng viên có thể là admin (quyền nền tảng, không phụ thuộc học kỳ)
		var count int64
		checkAdmin := `SELECT COUNT(*) FROM Admin WHERE ma_giang_vien_tham_chieu = ?`
		initialize.DB.Raw(checkAdmin, gv.MaGiangVien).Scan(&count)

		userType := "giangvien"
		if count > 0 {
			userType = "admin"
		}

		accessToken, _ := generateAccessToken(gv.MaGiangVien, userType)
		refreshToken, _ := generateRefreshToken(gv.MaGiangVien, userType)

		c.SetCookie("refresh_token", refreshToken, 365*24*60*60, "/", "", false, true)

		c.JSON(http.StatusOK, LoginResponse{
			Success:     true,
			Message:     "Đăng nhập thành công",
			Type:        userType, // admin hoặc giangvien
			AccessToken: accessToken,
		})
		return
	}

	c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Loại tài khoản không hợp lệ (sv hoặc gv)"})
}

// ======================= REFRESH HANDLER =======================
func RefreshToken(c *gin.Context) {
	refreshToken, err := c.Cookie("refresh_token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Thiếu refresh token"})
		return
	}
	token, err := jwt.Parse(refreshToken, func(token *jwt.Token) (interface{}, error) {
		return JWT_SECRET, nil
	})
	if err != nil || !token.Valid {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Refresh token không hợp lệ"})
		return
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || claims["type"] != "refresh" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Token không hợp lệ"})
		return
	}

	userID := claims["user_id"].(string)
	userType := claims["user_type"].(string)

	newAccessToken, _ := generateAccessToken(userID, userType)

	c.JSON(http.StatusOK, gin.H{
		"access_token": newAccessToken,
	})
}
