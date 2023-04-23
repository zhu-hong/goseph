package service

import (
	"io/fs"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func RunService(assets fs.FS, engine *gin.Engine) {
	// 程序运行的文件夹
	exe, _ := os.Executable()
	exedir := filepath.Dir(exe)

	gin.SetMode(gin.ReleaseMode)

	engine.SetTrustedProxies(nil)

	// 20G限制
	engine.MaxMultipartMemory = 1024 * 1024 * 1024 * 20

	engine.StaticFile("/favicon.ico", "frontend/dist/favicon.ico")

	staticFiles, _ := fs.Sub(assets, "frontend/dist")
	engine.StaticFS("/static/v1", http.FS(staticFiles))

	// 跨域
	engine.Use(cors.Default())

	router := engine.Group("api/v1")
	{
		// 检查文件是否已上传或者上传了多少个分片
		router.GET("/CheckFile", func(ctx *gin.Context) {
			type ChunkPaylod struct {
				Hash     string `form:"hash" binding:"required"`
				FileName string `form:"fileName" binding:"required"`
			}

			var paylod ChunkPaylod
			if err := ctx.ShouldBindQuery(&paylod); err != nil {
				ctx.JSON(http.StatusBadRequest, gin.H{
					"error": err.Error(),
				})
				return
			}

			hash := paylod.Hash
			savePath := filepath.Join(exedir, "files", hash+filepath.Ext(paylod.FileName))

			_, err := os.Stat(savePath)

			// 存在这个文件了
			if err == nil {
				ctx.JSON(http.StatusOK, gin.H{
					"exist":  1,
					"chunks": []string{},
					"file":   hash + filepath.Ext(paylod.FileName),
				})
				return
			}

			// 查看有没有切片
			chunksPath := filepath.Join(exedir, "temp", hash)
			_, err = os.Stat(chunksPath)

			// 存在切片
			if err == nil {
				files, _ := os.ReadDir(chunksPath)

				chunks := []int{}
				for _, file := range files {
					index, _ := strconv.Atoi(file.Name())

					chunks = append(chunks, index)
				}

				ctx.JSON(http.StatusOK, gin.H{
					"exist":  2,
					"chunks": chunks,
					"file":   "",
				})
				return
			}

			ctx.JSON(http.StatusOK, gin.H{
				"exist":  0,
				"chunks": []string{},
				"file":   "",
			})
		})
	}

	engine.Run("0.0.0.0:1122")
}
