

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
