package main

import "sync"

//user controll
var hub *Hub

func init() {
	hub = &Hub{
		UserMap: make(map[string][]*TaskProfile),
		lock:    sync.RWMutex{},
	}
}

type Hub struct {
	UserMap map[string][]*TaskProfile
	lock    sync.RWMutex
}

func (h *Hub) AddTask(task *TaskProfile) {
	h.lock.Lock()
	defer h.lock.Unlock()
	if _, ok := h.UserMap[task.User]; !ok {
		h.UserMap[task.User] = make([]*TaskProfile, 0)
	}
	h.UserMap[task.User] = append(h.UserMap[task.User], task)
}

func (h *Hub) GetTasks(token string) []*TaskProfile {
	h.lock.RLock()
	defer h.lock.RUnlock()
	if c, ok := h.UserMap[token]; ok {
		return c
	}
	return []*TaskProfile{}
}

func (h *Hub) Remove(token string) {
	h.lock.Lock()
	defer h.lock.Unlock()
	delete(h.UserMap, token)
}
