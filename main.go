package main

import (
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.LoadHTMLFiles("./web/build/index.html")
	r.Static("/static", "./web/build/static")

	api := r.Group("/api", CrosHandler(), JWT())
	{
		api.POST("/upload", UploadFile)
		api.POST("/createTask", CreateTask, CrosHandler())
		api.GET("/getTasks", GetTasks)
		api.GET("/getAnalyticjobs", GetAnalyticJobs)
	}

	r.NoRoute(func(c *gin.Context) {
		c.HTML(200, "index.html", nil)
	})

	go processor.Run()
	log.Fatal(r.Run(":8877"))

}
