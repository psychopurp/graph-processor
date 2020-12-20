package main

import (
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.LoadHTMLFiles("./web/build/index.html")
	r.Static("/static", "./web/build/static")

	api := r.Group("/api", CrosHandler())
	{
		api.POST("/upload", UploadFile)
		api.POST("/createTask", CreateTask,CrosHandler())
		api.GET("/getTasks", GetTasks)
		api.GET("/getAnalyticjobs", GetAnalyticJobs)
	}

	r.NoRoute(func(c *gin.Context) {
		c.HTML(200, "index.html", nil)
	})

	log.Fatal(r.Run(":8899"))
}
