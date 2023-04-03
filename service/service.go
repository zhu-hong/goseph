package service

import "github.com/gin-gonic/gin"

func RunService() {
	r := gin.Default()

	r.Run()
}
