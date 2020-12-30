package main

import (
	"fmt"
	"log"
	"os"
	"path"
	"time"

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
			St:   -1,
			Msg:  "参数错误",
			Data: "",
		})
		return
	}
	token := getToken(c)
	taskProfile := NewTaskProfile(&Task{
		User:         token,
		Name:         req.Name,
		TaskFile:     req.FilePath,
		AnalyticJobs: req.AnalyticJobs,
		SampleRate:   req.SampleRate,
	})

	log.Println(req, taskProfile)
	processor.AddTask(taskProfile)
	c.JSON(200, &Response{Data: "hello"})
}

func DeleteTask(c *gin.Context) {

}

func GetTasks(c *gin.Context) {
	token := getToken(c)
	c.JSON(200, &Response{
		St:   0,
		Msg:  "",
		Data: hub.GetTasks(token),
	})

}

func GetAnalyticJobs(c *gin.Context) {
	c.JSON(200, &Response{
		St:   0,
		Msg:  "",
		Data: JobsList,
	})
}

func UploadFile(c *gin.Context) {
	form, _ := c.MultipartForm()
	files := form.File["file"]
	dest := ""
	for _, file := range files {
		log.Print(file.Filename)
		paths := "tmp"
		if _, err := os.Stat(paths); os.IsNotExist(err) {
			_ = os.Mkdir(paths, os.ModePerm)
		}
		dst := path.Join("tmp/", fmt.Sprint(time.Now().Unix())+"_"+file.Filename)
		dest = dst
		//上传文件到指定的目录
		err := c.SaveUploadedFile(file, dst)
		if err != nil {
			c.JSON(200, &Response{
				St:   -1,
				Msg:  "上传文件失败 " + err.Error(),
				Data: "",
			})
			return
		}
	}
	c.JSON(200, &Response{Data: dest})

}

func getToken(c *gin.Context) string {
	return c.GetHeader("token")
}
