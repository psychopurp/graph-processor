import networkx as nx
import matplotlib.pyplot as plt
import random
from sklearn.cluster import KMeans
import numpy as np
from networkx.algorithms import node_classification
import os


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
    degree = nx.degree_histogram(G)
    x = range(len(degree))  # 生成X轴序列，从1到最大度
    summ = float(sum(degree))
    y = [z / summ for z in degree]  # 将频次转化为频率，利用列表内涵
    # plt.scatter(x, y, s=1, color=(1, 0, 0))
    plt.loglog(x, y, color="blue", linewidth=2)  # 在双对坐标轴上绘制度分布曲线
    name = filename.split(".")[0]+"_degree.jpg"
    plt.savefig(filename.split(".")[0]+"_degree.jpg")  # 显示图表
    return '/'.join(name.split("/")[-2:])


def clustering(G):
    '''
    聚类系数计算
    '''
    res = nx.clustering(G)
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


def link_predict(G):
    '''
    链路预测
    '''
    res = nx.jaccard_coefficient(G, list(G.edges)[:])
    return res


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
    name = filename.split(".")[0]+"_kmeans.jpg"
    plt.savefig(filename.split(".")[0]+"_kmeans.jpg")  # 显示图表
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
    file = b'/mnt/f/WorkSpace/GO/graph-processor/app/tmp/phone_sample.edge'
    f = str(file, "utf-8")
    print(str(file), f)
    file = f
    G = read_edge(str(file))
    path = K_means_clustering(G, file)
    print(path)


if __name__ == "__main__":
    test()

    # degree_histogram()
    # clustering()
    # G = read_edge("./func/HU_edges.csv")
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
