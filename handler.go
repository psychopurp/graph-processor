package main

import (
	"log"

	"github.com/gin-gonic/gin"
)

type Response struct {
	St   int         `json:"st"`
	Msg  string      `json:"msg"`
	Data interface{} `json:"data"`
}

type CreateTaskRequest struct {
	Name         string   `json:"name"`
	FilePath     string   `json:"file_path"`
	SampleRate   float64  `json:"sample_rate"`
	AnalyticJobs []string `json:"analytic_jobs"`
}

func CreateTask(c *gin.Context) {
	req := new(CreateTaskRequest)
	err := c.BindJSON(req)
	if err != nil {
		c.JSON(200, &Response{
			St:  -1,
			Msg: "参数错误",
			Data: "",
		})
		return
	}
	log.Println(req)
	c.JSON(200, &Response{Data: "hello"})
}

func DeleteTask(c *gin.Context) {

}

func GetTasks(c *gin.Context) {

}

func GetAnalyticJobs(c *gin.Context) {
	c.JSON(200, &Response{
		St:   0,
		Msg:  "",
		Data: JobsList,
	})
}
