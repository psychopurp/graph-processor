package main

import (
	"context"
	"log"
	"sync"
)

var (
	processor *Processor
)

func init() {
	processor = NewProcessor()
}

type Processor struct {
	ctx   context.Context
	tasks map[string]*TaskProfile

	register   chan *TaskProfile
	unregister chan *TaskProfile
	close      chan error

	lock sync.RWMutex
}

func NewProcessor() *Processor {
	ctx := context.Background()
	return &Processor{
		ctx:        ctx,
		tasks:      make(map[string]*TaskProfile),
		register:   make(chan *TaskProfile, 1000),
		unregister: make(chan *TaskProfile, 1000),
		lock:       sync.RWMutex{},
		close:      make(chan error),
	}
}

func (p *Processor) Run() {
	defer func() {
		close(p.close)
		close(p.unregister)
		close(p.register)
	}()

	for {
		select {
		//注册任务
		case task := <-p.register:
			p.lock.Lock()
			p.tasks[task.Name] = task
			p.lock.Unlock()
		//注销任务
		case task := <-p.unregister:
			p.lock.Lock()
			delete(p.tasks, task.Name)
			p.lock.Unlock()
		//取消
		case err := <-p.close:
			log.Print(err)
			return
		}

	}
}

func (p *Processor) Close(err error) {
	p.close <- err
}

func (p *Processor) AddTask(taskProfile *TaskProfile) {
	p.register <- taskProfile
}
