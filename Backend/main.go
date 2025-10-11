package main

import (
	"net/http"

	"Backend/controller/auth_middle"
	"Backend/controller/login"
	"Backend/initialize"
	"Backend/migrate"

	"github.com/gin-gonic/gin"
)

func init() {
	initialize.LoadEnv()
	initialize.ConnectDB()
}

func main() {
	migrate.MigrateData()

	// Tạo router chính của Gin
	router := gin.Default()

	// Endpoint Đăng nhập / Refresh token
	router.POST("/api/login", login.Login)
	router.POST("/api/refresh", login.RefreshToken)

	// Nhóm API yêu cầu xác thực (dùng AuthMiddleware)
	api := router.Group("/api")
	api.Use(auth_middle.AuthMiddleware())
	{
		// /api/me → Lấy thông tin hiện tại trong token
		api.GET("/me", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"user_id":   c.GetString("user_id"),
				"user_type": c.GetString("user_type"),
				"hoc_ky_id": c.GetString("hoc_ky_id"),
			})
		})

		// ----------------------------------------------------
		// /api/session/select-hocky → Chọn học kỳ
		//    - Dùng để cập nhật user_type theo học kỳ
		//    - Toàn bộ logic nằm trong controller.SelectHocKy
		// ----------------------------------------------------
		api.POST("/session/select-hocky", auth_middle.SelectHocKy)

		// ----------------------------------------------------
		// Ví dụ 1: API tạo tiêu chí (cho giảng viên trở lên)
		// ----------------------------------------------------
		// api.POST("/tieuchi",
		// 	tieuchi.RequireUserTypes("giangvien", "truongkhoa", "chuyenviendaotao"),
		// 	tieuchi.TaoTieuChi,
		// )

		// ----------------------------------------------------
		// Ví dụ 2: Dashboard lớp trưởng
		// ----------------------------------------------------
		api.GET("/loptruong/dashboard",
			auth_middle.RequireUserTypes("loptruong"),
			func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{"ok": true, "msg": "Dashboard lớp trưởng"})
			},
		)

		// ----------------------------------------------------
		// Ví dụ 3: Trang phê duyệt cho Trưởng khoa
		// ----------------------------------------------------
		api.GET("/khoa/pheduyet",
			auth_middle.RequireUserTypes("truongkhoa"),
			func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{"ok": true, "msg": "Xin chào Trưởng khoa"})
			},
		)

		// ----------------------------------------------------
		// Ví dụ 4: Panel dành cho Chuyên viên Đào tạo
		// ----------------------------------------------------
		api.GET("/cvdt/panel",
			auth_middle.RequireUserTypes("chuyenviendaotao"),
			func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{"ok": true, "msg": "Panel Chuyên viên Đào tạo"})
			},
		)
	}

	router.Run()
}
