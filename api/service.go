package service

import (
	"io"
	"io/fs"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strconv"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func RunService(assets fs.FS, engine *gin.Engine) {
	// 静态网页代理
	staticFiles, _ := fs.Sub(assets, "frontend/dist")
	engine.StaticFS("/z", http.FS(staticFiles))

	// 跨域
	engine.Use(cors.Default())

	// websocket服务
	wsHub := NewHub()
	go wsHub.Run()

	router := engine.Group("/api")
	{
		// websocket服务
		router.GET("WS", func(ctx *gin.Context) {
			Http4WSController(ctx, wsHub)
		})

		// 检查文件是否已上传或者上传了多少个分片
		router.GET("CheckFile", func(ctx *gin.Context) {
			type ChunkPaylod struct {
				Hash     string `form:"hash" binding:"required"`
				FileName string `form:"fileName" binding:"required"`
			}

			var paylod ChunkPaylod
			if err := ctx.ShouldBindQuery(&paylod); err != nil {
				ctx.JSON(http.StatusBadRequest, gin.H{
					"message": err.Error(),
				})
				return
			}

			hash := paylod.Hash
			savePath := filepath.Join(CachePath, "files", hash+filepath.Ext(paylod.FileName))

			// 存在这个文件了
			if _, err := os.Stat(savePath); err == nil {
				ctx.JSON(http.StatusOK, gin.H{
					"exist":  true,
					"chunks": []string{},
					"file":   hash + filepath.Ext(paylod.FileName),
				})
				return
			}

			// 查看有没有切片
			chunksPath := filepath.Join(CachePath, "temp", hash)

			// 存在切片
			if _, err := os.Stat(chunksPath); err == nil {
				files, _ := os.ReadDir(chunksPath)

				chunks := []int{}
				for _, file := range files {
					index, _ := strconv.Atoi(file.Name())

					chunks = append(chunks, index)
				}

				ctx.JSON(http.StatusOK, gin.H{
					"exist":  false,
					"chunks": chunks,
					"file":   "",
				})
				return
			}

			ctx.JSON(http.StatusOK, gin.H{
				"exist":  false,
				"chunks": []string{},
				"file":   "",
			})
		})

		// 上传文件
		router.POST("File", func(ctx *gin.Context) {
			file, err := ctx.FormFile("file")

			if err != nil {
				ctx.JSON(http.StatusBadRequest, gin.H{
					"message": err.Error(),
				})
				return
			}

			if file.Size > 32<<20 {
				ctx.JSON(http.StatusBadRequest, gin.H{
					"message": "文件超过32MB",
				})
				return
			}

			hash := ctx.Request.FormValue("hash")

			if len(hash) == 0 {
				ctx.JSON(http.StatusBadRequest, gin.H{
					"message": "未提供hash值",
				})
				return
			}

			index := ctx.Request.FormValue("index")

			// 上传了整个文件
			if len(index) == 0 {
				savePath := filepath.Join(CachePath, "files", hash+filepath.Ext(file.Filename))

				if err := os.MkdirAll(filepath.Join(CachePath, "files"), os.ModePerm); err != nil {
					ctx.JSON(http.StatusInternalServerError, gin.H{
						"message": err.Error(),
					})
					return
				}

				if err := ctx.SaveUploadedFile(file, savePath); err != nil {
					ctx.JSON(http.StatusInternalServerError, gin.H{
						"message": err.Error(),
					})
					return
				}

				ctx.JSON(http.StatusOK, gin.H{
					"file": hash + filepath.Ext(file.Filename),
				})
				return
			}

			if len(index) == 0 {
				ctx.JSON(http.StatusBadRequest, gin.H{
					"message": "未提供文件分片索引",
				})
				return
			}

			// 文件碎片目录
			if err := os.MkdirAll(filepath.Join(CachePath, "temp", hash), os.ModePerm); err != nil {
				ctx.JSON(http.StatusInternalServerError, gin.H{
					"message": err.Error(),
				})
				return
			}
			// 文件碎片保存路径
			savePath := filepath.Join(CachePath, "temp", hash, index)

			if err := ctx.SaveUploadedFile(file, savePath); err != nil {
				ctx.JSON(http.StatusInternalServerError, gin.H{
					"message": err.Error(),
				})
				return
			}

			ctx.JSON(http.StatusOK, gin.H{
				"file": "",
			})
		})

		// 合并文件
		router.POST("MergeFile", func(ctx *gin.Context) {
			type MergePaylod struct {
				Hash     string `json:"hash" binding:"required"`
				FileName string `json:"fileName" binding:"required"`
			}

			var paylod MergePaylod
			if err := ctx.ShouldBindJSON(&paylod); err != nil {
				ctx.JSON(http.StatusBadRequest, gin.H{
					"message": err.Error(),
				})
				return
			}

			mergePath := filepath.Join(CachePath, "temp", paylod.Hash)

			// 没有这个合集
			if _, err := os.Stat(mergePath); err != nil {
				ctx.JSON(http.StatusInternalServerError, gin.H{
					"message": "没找到文件碎片文件夹",
				})
				return
			}

			if err := os.MkdirAll(filepath.Join(CachePath, "files"), os.ModePerm); err != nil {
				ctx.JSON(http.StatusInternalServerError, gin.H{
					"message": "文件保存文件夹创建失败",
				})
				return
			}
			savePath := filepath.Join(CachePath, "files", paylod.Hash+filepath.Ext(paylod.FileName))

			finFile, err := os.Create(savePath)
			if err != nil {
				ctx.JSON(http.StatusInternalServerError, gin.H{
					"message": "创建合并文件失败",
				})
				return
			}
			defer finFile.Close()

			fs, err := os.ReadDir(mergePath)
			if err != nil {
				ctx.JSON(http.StatusInternalServerError, gin.H{
					"message": "读取碎片文件夹失败",
				})
				return
			}

			sort.Slice(fs, func(i, j int) bool {
				index1, err1 := strconv.Atoi(fs[i].Name())
				index2, err2 := strconv.Atoi(fs[j].Name())

				if err1 != nil || err2 != nil {
					return fs[i].Name() < fs[j].Name()
				}

				return index1 < index2
			})

			for _, f := range fs {
				file, err := os.Open(filepath.Join(mergePath, f.Name()))
				if err != nil {
					ctx.JSON(http.StatusInternalServerError, gin.H{
						"message": "文件碎片" + paylod.FileName + f.Name() + "读取失败",
					})
					return
				}
				defer file.Close()

				if _, err := io.Copy(finFile, file); err != nil {
					ctx.JSON(http.StatusInternalServerError, gin.H{
						"message": "文件碎片" + paylod.FileName + f.Name() + "合并失败",
					})
					return
				}
			}

			ctx.JSON(http.StatusOK, gin.H{
				"file": paylod.Hash + filepath.Ext(paylod.FileName),
			})

			os.RemoveAll(mergePath)
		})

		router.GET("File/:name", func(ctx *gin.Context) {
			if name := ctx.Param("name"); name != "" {
				file := filepath.Join(CachePath, "files", name)

				if _, err := os.Stat(file); err != nil {
					ctx.Status(http.StatusNotFound)
					return
				}
				// ctx.Header("Content-Description", "File Transfer")
				// ctx.Header("Content-Transfer-Encoding", "binary")
				// ctx.Header("Content-Disposition", "attachment; filename="+path)
				// ctx.Header("Content-Type", "application/octet-stream")
				ctx.File(file)
			} else {
				ctx.Status(http.StatusNotFound)
			}
		})
	}

	engine.Run(":12138")
}
