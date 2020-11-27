package main

import "github.com/gin-gonic/gin"

type Response struct {
	St   int         `json:"st"`
	Msg  string      `json:"msg"`
	Data interface{} `json:"data"`
}

func CreateTask(c *gin.Context) {

}

func DeleteTask(c *gin.Context) {

}

func GetTasks(c *gin.Context) {

}

func GetAnalyticJobs(c *gin.Context) {
	var jobs []string
	for k, _ := range analyticJobs {
		jobs = append(jobs, k)
	}
	c.JSON(200, &Response{
		St:   0,
		Msg:  "",
		Data: jobs,
	})
}
