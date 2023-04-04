package main

import (
	"io/fs"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func runService() {
	gin.SetMode(gin.ReleaseMode)

	engine := gin.Default()

	engine.SetTrustedProxies(nil)

	// 20G限制
	engine.MaxMultipartMemory = 1024 * 1024 * 1024 * 20

	engine.StaticFile("/favicon.ico", "frontend/dist/favicon.ico")
	staticFiles, _ := fs.Sub(Assets, "frontend/dist")
	engine.StaticFS("/static", http.FS(staticFiles))

	// cors
	engine.Use(cors.New(cors.Config{
		AllowMethods:     []string{"PUT", "GET", "POST"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		AllowOriginFunc: func(origin string) bool {
			return true
		},
		MaxAge: 12 * time.Hour,
	}))

	router := engine.Group("api/v1")
	{
		router.GET("/ping", func(ctx *gin.Context) {
			ctx.JSON(http.StatusOK, gin.H{
				"msg": "🙏",
			})
		})
		router.POST("upload", func(ctx *gin.Context) {
			ctx.JSON(http.StatusOK, gin.H{
				"msg": ctx.Request.FormValue("isFrag"),
			})
		})
	}

	engine.Run(":1122")
}
