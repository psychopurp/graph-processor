
from flask import json, jsonify, Blueprint, request, make_response
from flask.helpers import send_file, send_from_directory
from app import task
import os
import uuid
from app import server
from app import degree_distribution


handler_print = Blueprint("handler", __name__)


task_hub = {}


def response(st, msg, data):
    return jsonify({"st": st, "msg": msg, "data": data})


@handler_print.route("/api/getAnalyticjobs", methods=['GET'])
def getAnalyticJobs():
    token = request.headers.get("token")
    # print("token ", token)
    resp = make_response(response(0, "", task.JobList))

    if not token or token == "undefined":
        token = str(uuid.uuid1())
        resp.headers.set("token", token)
    return resp


@handler_print.route("/api/upload", methods=["POST"])
def uploadFile():
    f1 = request.files.get("edgeFile")
    f2 = request.files.get("nodeFile")
    basepath = os.path.dirname(__file__)
    if not os.path.isdir(basepath+"/tmp"):
        os.makedirs(basepath+"/tmp")
    upload_path1 = os.path.join(basepath, "tmp/", f1.filename)
    f1.save(upload_path1)
    if f2:
        upload_path2 = os.path.join(basepath, "tmp/", f2.filename)
        f2.save(upload_path2)

    return response(0, "", {"edgeFile": "/tmp/"+f1.filename, "nodeFile": "" if not f2 else "/tmp/" + f2.filename})


@handler_print.route("/api/createTask", methods=["POST"])
def createTask():
    token = request.headers.get("token")
    print("token ", token)
    data = request.get_json()
    t = task.Task(token, data["name"], data["file_path"]["edgeFile"],
                  data["file_path"]["nodeFile"], data["sample_rate"], data["analytic_jobs"])

    task_hub.setdefault(token, [])

    dir = os.path.dirname(__file__)
    path = os.path.join(dir, t.edge_file[1:])

    G = degree_distribution.read_edge(path)
    g = degree_distribution.sample(G, float(t.sample_rate)/100.0)
    sample_file = path.split(".")
    sample_file = sample_file[0]+"_sample."+sample_file[1]
    with open(sample_file, "w+") as s:
        for i in g.edges():
            s.write("{},{}\n".format(i[0], i[1]))

    # print(t.sample_rate, sample_file)
    task_hub[token].append(task.TaskProfile(t, sample_pic_path=sample_file))

    return response(0, "", "hello")


@handler_print.route("/api/getTasks", methods=["GET"])
def getTasks():
    token = request.headers.get("token")

    print("token ", token, " hub ", task_hub)
    if not token:
        return response(0, "", [])
    task_list = task_hub.get(token)
    data_list = []
    for t in task_list:
        if not t:
            return response(0, "", [])
        item = {
            "name": t.task_name,
            "task_file": t.edge_file,
            "node_file": t.node_file,
            "job_status": t.job_status,
            "job_status_list": t.job_status_list,
            "user": t.user_name,
            "sample_rate": t.sample_rate,
            "sample_pic_path": t.sample_pic_path,
        }
        status_list = []
        status_dict = {}
        for j in t.job_status:
            status_dict[j] = t.job_status[j].get_json()
            status_list.append(status_dict[j])
        item["job_status"] = status_dict[j]
        item["job_status_list"] = status_list

        data_list.append(item)
    return response(0, "", data_list)


@handler_print.route("/api/getEdges", methods=["GET"])
def getEdges():
    qs = request.query_string
    data = []
    with open(qs, 'r') as f:
        for ll in f:
            line = ll.strip().split(",")
            data.append((line[0], line[1]))
    return response(0, "", data)


@handler_print.route("/api/getDegreeHistogram", methods=["GET"])
def get_degree_histogram():
    qs = request.query_string
    qs = str(qs, "utf-8")
    G = degree_distribution.read_edge(qs)
    path = degree_distribution.degree_histogram(G, qs)
    # print(path)
    return response(0, "", "http://127.0.0.1:{}/{}".format(server.PORT, path))


@handler_print.route("/api/getKmeans", methods=["GET"])
def get_k_means():
    qs = request.query_string
    qs = str(qs, "utf-8")
    G = degree_distribution.read_edge(qs)
    path = degree_distribution.K_means_clustering(G, qs)
    return response(0, "", "http://127.0.0.1:{}/{}".format(server.PORT, path))


@handler_print.route("/api/getCluster", methods=["GET"])
def get_cluster():
    qs = request.query_string
    qs = str(qs, "utf-8")
    processor = degree_distribution.GraphProcessor(qs)
    data, file_path = processor.clustering(processor.G)

    return response(0, "", {"path": file_path, "list": data[:1000]})


@handler_print.route("/api/getPredictLink", methods=["GET"])
def get_predict_link():
    qs = request.query_string
    qs = str(qs, "utf-8")
    processor = degree_distribution.GraphProcessor(qs)
    data, file_path = processor.link_predict(processor.G)

    return response(0, "", {"path": file_path})


@handler_print.route("/api/downloadSample", methods=["GET"])
def download_sample():
    qs = request.args.get("file")
    print(qs)
    base_dir = os.path.dirname(__file__)
    base_dir = os.path.join(base_dir, "tmp")
    return send_file(qs, as_attachment=True, attachment_filename=qs.split("/")[-1])


@handler_print.before_app_request
def JWT():
    pass
    # if not token:
    #     token = str(uuid.uuid1())
    # # print(request.headers)
    # resp = make_response()
    # resp.headers.set("token", token)


if __name__ == "__main__":
    # basepath = os.path.dirname(__file__)
    # if not os.path.isdir(basepath+"/tmp"):
    #     os.makedirs(basepath+"/tmp")
    # print(os.path.isdir(basepath+"/tmp"))
    # print(basepath)
    with open('../func/HU_edges_lite.csv', 'r') as f:
        for ll in f:
            line = ll.strip().split(",")
            print(line)
