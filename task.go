package main

import "sync"

var (
	JobsList     = []string{"显示节点度分布图", "计算聚类系数", "节点分类", "节点聚类", "链路预测"}
	analyticJobs = map[string]string{
		"显示节点度分布图": "",
		"计算聚类系数":   "",
		"节点分类":     "",
		"节点聚类":     "",
		"链路预测":     "",
	}
	StatusSuccess = 1
	StatuFail     = 2
	rMutex        sync.RWMutex
)

type Task struct {
	User         string   `json:"user"`
	Name         string   `json:"name"`
	TaskFile     string   `json:"task_file"`
	AnalyticJobs []string `json:"analytic_jobs"`
	SampleRate   float64  `json:"sample_rate"`
}

type TaskProfile struct {
	Task
	SamplePicPath string             `json:"sample_pic_path"`
	JobStatus     map[string]*Status `json:"job_status"`
	JobStatusList []*Status          `json:"job_status_list"`
}

type Status struct {
	JobName        string `json:"job_name"`
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
	jobStatusList := make([]*Status, 0)
	for _, v := range task.AnalyticJobs {
		jobStatus[v] = new(Status)
		jobStatus[v].JobName = v
		jobStatusList = append(jobStatusList, jobStatus[v])
	}
	profile.JobStatus = jobStatus
	profile.JobStatusList = jobStatusList
	return profile
}

func (t *Task) GetName() string {
	return t.User + "_" + t.Name
}
