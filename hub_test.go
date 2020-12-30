package main

import (
	"os"
	"testing"
)

func TestHub_AddTask(t *testing.T) {
	task := NewTaskProfile(&Task{
		User: "Elyar",
		Name: "11",
	})
	hub.AddTask(task)

	t.Log(hub.GetTasks("Elyar"))

}


func TestOs(t*testing.T){
	_=os.RemoveAll("./tmp")

}
