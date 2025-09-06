package controller

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
	Success bool   `json:"success"`
	Message string `json:"message"`
	Type    string `json:"type,omitempty"`
	Token   string `json:"token,omitempty"`
}

// ======================= SECRET KEY =======================
var jwtSecret = []byte(os.Getenv("JWT_SECRET"))

// ======================= TOKEN GENERATOR =======================
func generateToken(userID string, userType string) (string, error) {
	claims := jwt.MapClaims{
		"user_id":   userID,
		"user_type": userType,
		"exp":       time.Now().Add(time.Hour * 24).Unix(), // token hết hạn sau 24h
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

// ======================= LOGIN HANDLER =======================
func Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, LoginResponse{
			Success: false,
			Message: "Dữ liệu gửi lên không hợp lệ: " + err.Error(),
		})
		return
	}

	if req.Type == "sv" {
		var sv model.SinhVien
		query := `SELECT Ma_SV, HoDem, Ten, GioiTinh, NgaySinh, NoiSinh, MatKhau
		          FROM SinhVien WHERE Ma_SV = ? AND MatKhau = ?`
		result := initialize.DB.Raw(query, req.Username, req.Password).Scan(&sv)
		if result.Error != nil || sv.MaSinhVien == "" {
			c.JSON(http.StatusUnauthorized, LoginResponse{
				Success: false,
				Message: "Sai tài khoản hoặc mật khẩu",
			})
			return
		}

		token, _ := generateToken(sv.MaSinhVien, "sinhvien")

		c.JSON(http.StatusOK, LoginResponse{
			Success: true,
			Message: "Đăng nhập thành công",
			Type:    "sinhvien",
			Token:   token,
		})
		return
	} else if req.Type == "gv" {
		var gv model.GiangVien
		query := `SELECT Ma_GV, HoDem, Ten, GioiTinh, NgaySinh, QuocTich, MatKhau
		          FROM GiangVien WHERE Ma_GV = ? AND MatKhau = ?`
		result := initialize.DB.Raw(query, req.Username, req.Password).Scan(&gv)
		if result.Error != nil || gv.MaGiangVien == "" {
			c.JSON(http.StatusUnauthorized, LoginResponse{
				Success: false,
				Message: "Sai tài khoản hoặc mật khẩu",
			})
			return
		}

		token, _ := generateToken(gv.MaGiangVien, "giangvien")

		c.JSON(http.StatusOK, LoginResponse{
			Success: true,
			Message: "Đăng nhập thành công",
			Type:    "giangvien",
			Token:   token,
		})
		return
	}

	c.JSON(http.StatusBadRequest, LoginResponse{
		Success: false,
		Message: "Loại tài khoản không hợp lệ (sv hoặc gv)",
	})
}

// ======================= END =======================
