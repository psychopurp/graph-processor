import networkx as nx
import matplotlib.pyplot as plt


def degree_histogram():
    '''
    节点度分布图生成
    '''
    filename = "HU_edges.csv"
    G = nx.read_edgelist("./func/"+filename, delimiter=",")
    degree = nx.degree_histogram(G)
    x = range(len(degree))  # 生成X轴序列，从1到最大度
    summ = float(sum(degree))
    y = [z / summ for z in degree]  # 将频次转化为频率，利用列表内涵
    plt.scatter(x, y, s=1, color=(1, 0, 0))
    # plt.loglog(x, y, color="blue", linewidth=2)  # 在双对坐标轴上绘制度分布曲线
    plt.savefig(filename.split(".")[0]+".jpg")  # 显示图表


def clustering():
    '''
    聚类系数计算
    '''
    filename = "HU_edges.csv"
    G = nx.read_edgelist("./func/" + filename, delimiter=",")
    res = nx.clustering(G)
    print(res)


if __name__ == "__main__":
    # degree_histogram()
    clustering()
