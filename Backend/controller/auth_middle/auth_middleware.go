package auth_middle

import (
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

var JWT_SECRET = []byte(os.Getenv("JWT_SECRET"))

// =======================
//  AUTH: Xác thực JWT
// =======================

// Xác thực "Bearer <access_token>", bắt buộc type=="access",
// set user_id, user_type và (nếu có) hoc_ky_id vào context.
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		ah := c.GetHeader("Authorization")
		if ah == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Thiếu Authorization header"})
			c.Abort()
			return
		}
		parts := strings.Split(ah, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Sai định dạng token"})
			c.Abort()
			return
		}
		tokenStr := parts[1]

		token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) {
			return JWT_SECRET, nil
		})
		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token không hợp lệ hoặc đã hết hạn"})
			c.Abort()
			return
		}
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok || claims["type"] != "access" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token không hợp lệ"})
			c.Abort()
			return
		}

		c.Set("user_id", claims["user_id"])
		c.Set("user_type", claims["user_type"])

		// hỗ trợ học kỳ: nếu token có hoc_ky_id thì lưu vào context
		if hk, ok := claims["hoc_ky_id"]; ok {
			if s, _ := hk.(string); strings.TrimSpace(s) != "" {
				c.Set("hoc_ky_id", strings.TrimSpace(s))
			}
		}
		c.Next()
	}
}

// =======================
//  Helper: ký access token mới với học kỳ
// =======================

func MintAccessWithHocKy(userID, userType, hocKyID string) (string, error) {
	claims := jwt.MapClaims{
		"type":      "access",
		"user_id":   userID,
		"user_type": userType, // sinhvien | loptruong | giangvien | truongkhoa | chuyenviendaotao
		"hoc_ky_id": hocKyID,  // học kỳ được chọn
		"exp":       time.Now().Add(30 * time.Minute).Unix(),
	}
	tk := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return tk.SignedString(JWT_SECRET)
}
