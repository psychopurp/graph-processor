package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"sync"
	"syscall"
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
	hub        *Hub
	lock       sync.RWMutex
	sigChan    chan os.Signal
}

func NewProcessor() *Processor {
	ctx := context.Background()
	c := make(chan os.Signal)
	signal.Notify(c, syscall.SIGINT, syscall.SIGQUIT)
	return &Processor{
		ctx:        ctx,
		tasks:      make(map[string]*TaskProfile),
		register:   make(chan *TaskProfile, 1000),
		unregister: make(chan *TaskProfile, 1000),
		lock:       sync.RWMutex{},
		hub:        hub,
		close:      make(chan error),
		sigChan:    c,
	}
}

func (p *Processor) Run() {
	defer func() {
		log.Println("closing")
		close(p.close)
		close(p.unregister)
		close(p.register)
		signal.Stop(p.sigChan)
		close(p.sigChan)
		_ = os.RemoveAll("./tmp")
	}()

	for {
		select {
		//注册任务
		case task := <-p.register:
			p.lock.Lock()
			p.tasks[task.GetName()] = task
			p.hub.AddTask(task)
			p.lock.Unlock()
		//注销任务
		case task := <-p.unregister:
			p.lock.Lock()
			delete(p.tasks, task.Name)
			p.hub.Remove(task.User)
			p.lock.Unlock()
		//取消
		case err := <-p.close:
			log.Print(err)
			return

		case s := <-p.sigChan:
			log.Println("get signal shutdown ", s)
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
