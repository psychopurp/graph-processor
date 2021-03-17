

# 分析任务列表
JobList = ["显示节点度分布图", "计算聚类系数", "节点分类", "节点聚类", "链路预测"]
analyticJobs = {	"显示节点度分布图": "",
                 "计算聚类系数":   "",
                 "节点分类":     "",
                 "节点聚类":     "",
                 "链路预测":     "", }


class Task:
    def __init__(self, user_name, task_name, edge_file, node_file, sample_rate, analytic_jobs) -> None:
        self.task_name = task_name
        self.user_name = user_name
        self.edge_file = edge_file
        self.node_file = node_file
        self.sample_rate = sample_rate
        self.analytic_jobs = analytic_jobs


class TaskProfile(Task):
    def __init__(self, task: Task, sample_pic_path: str) -> None:
        super().__init__(task.user_name, task.task_name, task.edge_file,
                         task.node_file, task.sample_rate, task.analytic_jobs)
        self.sample_pic_path = sample_pic_path
        self.job_status = {}
        self.job_status_list = []

        for i in task.analytic_jobs:
            self.job_status.setdefault(i, TaskStatus(job_name=i))
            self.job_status_list.append(self.job_status[i])


class TaskStatus:
    def __init__(self, job_name, current_status=0, result_file_path='', reason="") -> None:
        self.job_name = job_name
        self.current_status = current_status
        self.result_file_path = result_file_path
        self.reason = reason

    def get_json(self):
        return {
            "job_name": self.job_name,
            "current_status": self.current_status,
            "result_file_path": self.result_file_path,
            "reason": self.reason
        }


if __name__ == "__main__":
    import json
    t = Task("elyar", "1hao", "/tmp", "", 0.5, ["1", "2", "3"])
    p = TaskProfile(t, "/ras")

    print(json.dumps(p.__dict__))
