package main

import "sync"

var (
	analyticJobs = map[string]string{
		"显示节点度分布图": "",
		"计算聚类系数":   "",
		"节点分类":     "",
		"节点聚类":     "",
	}
	StatusSuccess = 1
	StatuFail     = 2
	rMutex        sync.RWMutex
)


type Task struct {
	Name         string   `json:"name"`
	TaskFile     string   `json:"task_file"`
	AnalyticJobs []string `json:"analytic_jobs"`
	SampleRate   float64  `json:"sample_rate"`
}

type TaskProfile struct {
	Task
	SamplePicPath string             `json:"sample_pic_path"`
	JobStatus     map[string]*Status `json:"job_status"`
}

type Status struct {
	CurrentStatus  int    `json:"current_status"`
	ResultFilePath string `json:"result_file_path"`
	Reason         string `json:"reason"`
}

func NewTaskProfile(task *Task) *TaskProfile {
	profile := &TaskProfile{
		Task:          *task,
		SamplePicPath: "",
		JobStatus:     nil,
	}
	jobStatus := make(map[string]*Status, 0)
	for _, v := range task.AnalyticJobs {
		jobStatus[v] = new(Status)
	}
	profile.JobStatus = jobStatus
	return profile
}
