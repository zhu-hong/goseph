package service

import (
	"io/fs"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func RunService(assets fs.FS) {
	gin.SetMode(gin.ReleaseMode)

	engine := gin.Default()

	engine.SetTrustedProxies(nil)

	// 20G限制
	engine.MaxMultipartMemory = 1024 * 1024 * 1024 * 20

	engine.StaticFile("/favicon.ico", "frontend/dist/favicon.ico")
	staticFiles, _ := fs.Sub(assets, "frontend/dist")
	engine.StaticFS("/static", http.FS(staticFiles))

	// cors
	engine.Use(cors.Default())

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
