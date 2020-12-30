package main

import (
	"github.com/gin-gonic/gin"
	"github.com/rs/xid"
	"log"
)

//跨域访问：cross  origin resource share
func CrosHandler() gin.HandlerFunc {
	return func(context *gin.Context) {

		context.Header("Access-Control-Allow-Origin", "*") // 设置允许访问所有域
		context.Header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS")
		context.Header("Access-Control-Allow-Headers", "X-Requested-With, content-type")
		context.Header("Access-Control-Max-Age", "172800")
		context.Header("Access-Control-Allow-Credentials", "true")
		//context.Set("content-type", "application/json") //设置返回格式是json

		//处理请求
		context.Next()
	}
}

func JWT() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("token")
		if token == "" {
			id := xid.New()
			token = id.String()
			log.Println("token ",id.String())
			c.Writer.Header().Set("token", token)
		}
	}
}
