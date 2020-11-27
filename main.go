package main

import (
	"github.com/gin-gonic/gin"
	"log"
)

func main() {
	r := gin.Default()
	//r.LoadHTMLFiles("./web/build/index.html")
	//r.Static("/", "./web/build/static")
	api := r.Group("/api")
	{
		api.POST("/upload", CreateTask)
		api.POST("/createTask", CreateTask)
		api.GET("/getTasks", GetTasks)
		api.GET("/getAnalyticjobs", GetAnalyticJobs)
	}


	//r.NoRoute(func(c *gin.Context) {
	//	c.HTML(200, "index.html", nil)
	//})

	log.Fatal(r.Run(":7777"))
}
