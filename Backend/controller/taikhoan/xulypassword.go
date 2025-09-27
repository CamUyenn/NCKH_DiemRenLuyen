package taikhoan

import (
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func HashPassword(c *gin.Context, password string) string {
	// Check if password is empty
	if password == "" {
		c.JSON(400, gin.H{
			"error": "Password is empty",
		})
		return ""
	}

	// Hash password
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(400, gin.H{
			"error": "Failed to hash password",
		})
		return ""
	} else {
		c.JSON(200, gin.H{
			"message": "Password hashed successfully",
		})
	}
	return string(hashed)
}
