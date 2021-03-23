import networkx as nx
import matplotlib.pyplot as plt
import random
from sklearn.cluster import KMeans
import numpy as np
from networkx.algorithms import node_classification
import os
import matplotlib
import time
matplotlib.use('agg')
plt.rcParams['font.sans-serif'] = ['Arial Unicode MS']


class GraphProcessor:
    def __init__(self, filename):
        self.filename = self.parse_filename(filename)
        self.G = self.read_edge()
        self.base_dir = os.path.dirname(__file__)

        # print(self.base_dir)

    def parse_filename(self, name):
        return name

    def get_filename(self, task_type, file_type):
        # print(self.filename)
        name = self.filename.split(
            ".")[0]+"_{}_{}.{}".format(task_type, int(time.time()), file_type)
        return name

    def read_edge(self):
        '''
        读取边文件
        格式：node_1,node_2
        '''
        G = nx.read_edgelist(self.filename, delimiter=",")
        return G

    def read_node(filename, G):
        '''
        读取节点文件
        格式 ： node_id label
        '''
        with open("{}.node".format(filename), "r") as f:
            for l in f:
                line = l.split()
                G.add_nodes_from([(line[0], {"label": line[1]})])
        return G

    def clustering(self, G):
        '''
        聚类系数计算
        '''
        res = nx.clustering(G)
        name = self.get_filename('clustering', "txt")
        res = sorted(list(res.items()), key=lambda kv: (
            kv[1], kv[0]), reverse=True)
        new_filename = self.get_filename("clustering", "txt")
        with open(new_filename, "w+") as f:
            for i in res:
                f.write("{} {}\n".format(i[0], i[1]))
        return res[:1000], new_filename

    def link_predict(self, G):
        '''
        链路预测
        '''
        res = nx.jaccard_coefficient(G, list(G.edges)[:])
        res = sorted(list(res), key=lambda x: x[2], reverse=True)
        new_filename = self.get_filename("link_predict", "txt")
        with open(new_filename, "w+") as f:
            for i in res:
                f.write("{} {} {}\n".format(i[0], i[1], i[2]))

        return res, new_filename


def read_edge(filename):
    '''
    读取边文件
    格式：node_1,node_2
    '''
    G = nx.read_edgelist(filename, delimiter=",")
    return G


def read_node(filename, G):
    '''
    读取节点文件
    格式 ： node_id label
    '''
    with open("{}.node".format(filename), "r") as f:
        for l in f:
            line = l.split()
            G.add_nodes_from([(line[0], {"label": line[1]})])
    return G


def degree_histogram(G, filename):
    '''
    节点度分布图生成
    '''
    plt.clf()
    plt.cla()
    degree = nx.degree_histogram(G)
    x = range(len(degree))  # 生成X轴序列，从1到最大度
    summ = float(sum(degree))
    y = [z / summ for z in degree]  # 将频次转化为频率，利用列表内涵
    # plt.scatter(x, y, s=1, color=(1, 0, 0))
    plt.loglog(x, y, color="blue", linewidth=2)  # 在双对坐标轴上绘制度分布曲线
    plt.title("节点度分布图")
    name = filename.split(".")[0]+"_degree_{}.jpg".format(int(time.time()))
    plt.savefig(filename.split(".")[
                0]+"_degree_{}.jpg".format(int(time.time())))  # 显示图表
    return '/'.join(name.split("/")[-2:])


def clustering(G, filename):
    '''
    聚类系数计算
    '''
    res = nx.clustering(G)
    name = filename.split(".")[0]+"_degree_{}.jpg".format(int(time.time()))
    return res


def sample(G, rate=0.5):
    '''
    按照采样率进行随机采样
    '''
    edges = list(G.edges)
    chosen_edge = random.sample(edges, k=int(len(edges)*(1-rate)))
    for edge in chosen_edge:
        G.remove_edge(*edge)
    return G


def classification(G):
    '''
    节点分类
    必须是有label信息的节点
    '''
    res = node_classification.harmonic_function(G)
    return res


def K_means_clustering(G, filename, clusters=5):
    '''
    节点聚类
    '''
    plt.clf()
    plt.cla()
    X = []
    for v in G.edges:
        if v[0].isdigit() and v[1].isdigit():
            X.append([float(v[0]), float(v[1])])

    # #转化为numpy array
    X = np.array(X)
    # print(X)

    # 类簇的数量
    n_clusters = clusters

    # 开始调用函数聚类
    cls = KMeans(n_clusters).fit(X)

    # print(cls.labels_)

    # 画图
    markers = ['*', 'o', '+', 's', 'v']
    for i in range(n_clusters):
        members = cls.labels_ == i  # members是布尔数组
        plt.scatter(X[members, 0], X[members, 1], s=60,
                    marker=markers[i], c='b', alpha=0.5)  # 画与menbers数组中匹配的点
    name = filename.split(".")[0]+"_kmeans_{}.jpg".format(int(time.time()))
    plt.title("节点聚类图")
    plt.savefig(filename.split(".")[
                0]+"_kmeans_{}.jpg".format(int(time.time())))  # 显示图表

    return '/'.join(name.split("/")[-2:])


def hanlder():
    s = set()
    m = {}
    with open("./func/Phone_data.txt", 'r') as f:
        for line in f:
            l = line.split(",")
            s.add((l[1], l[3]))
            m[l[1]], m[l[3]] = l[2], l[4]
            # print(line.split(','))
    print(m)
    with open("./func/phone.node", "w+") as f:
        f.write("")
        for k in m:
            f.write("{} {}\n".format(k, m[k]))
    # print(s)
    with open("./func/phone.edge", "w+") as f:
        f.write("")
        for k in s:
            f.write("{},{}\n".format(k[0], k[1]))
    pass


def test():
    file = b'/Users/flame/Desktop/workspace/python_project/graph-processor/func/HU_edges.csv'
    f = str(file, "utf-8")
    print(str(file), f)
    file = f
    G = read_edge(str(file))
    # path = K_means_clustering(G, file)
    data = clustering(G)
    # print(list(data.items())[:100])
    print(sorted(list(data.items()), key=lambda kv: (
        kv[1], kv[0]), reverse=True)[:1000])
    # print(clustering(G))


def test_dict():
    key_value = {}

    # 初始化
    key_value[2] = 0.07692307692307693
    key_value[1] = 0.14285714285714285
    key_value[5] = 0
    key_value[4] = 0.1523809523809524
    key_value[6] = 0.1323529411764706
    key_value[3] = 0.013071895424836602
    print(sorted(key_value.items(), key=lambda kv: (kv[0], kv[1])))


def test_class():
    filename = '/Users/flame/Desktop/workspace/python_project/graph-processor/func/HU_edges.csv'
    p = GraphProcessor(filename)
    print(p.link_predict(p.G))


if __name__ == "__main__":
    # test()
    test_class()
    # test_dict()
    # print(time.now())

    # degree_histogram()
    # clustering()
    # G = read_edge("./func/HU_edges_lite.csv")
    # path = degree_histogram(G, "HU_edges_lite.csv")
    # print(path)
    # g = sample(G, 0.1)
    # with open("")
    # print(g.edges())

    # dir = '/mnt/f/WorkSpace/GO/graph-processor/app'
    # path = 'tmp/HU_edges.csv'
    # file_path = os.path.join(dir, path)
    # G = read_edge("/tmp/HU_edges.csv")
    # g = sample(G, 0.3)
    # f = file_path.split(".")
    # samp = f[0]+"_sample."+f[1]
    # with open(samp, "w+") as s:
    #     for i in g.edges():
    #         s.write("{},{}\n".format(i[0], i[1]))

    # print(samp)
    # print(os.path.join(dir, path))
    # hanlder()
