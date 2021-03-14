
from flask import json, jsonify, Blueprint, request, make_response
from app import task
import os
import uuid
from app import server


handler_print = Blueprint("handler", __name__)


task_hub = {}


def response(st, msg, data):
    return jsonify({"st": st, "msg": msg, "data": data})


@handler_print.route("/api/getAnalyticjobs", methods=['GET'])
def getAnalyticJobs():
    token = request.headers.get("token")
    # print("token ", token)
    resp = make_response(response(0, "", task.JobList))

    if not token:
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
    t = task.Task(token, data["name"], data["file_path"],
                  "node", data["sample_rate"], data["analytic_jobs"])

    # task_hub[]

    return response(0, "", "hello")


@handler_print.route("/api/getTasks", methods=["GET"])
def getTasks():
    pass


@handler_print.before_app_request
def JWT():
    pass
    # if not token:
    #     token = str(uuid.uuid1())
    # # print(request.headers)
    # resp = make_response()
    # resp.headers.set("token", token)


if __name__ == "__main__":
    basepath = os.path.dirname(__file__)
    if not os.path.isdir(basepath+"/tmp"):
        os.makedirs(basepath+"/tmp")
    print(os.path.isdir(basepath+"/tmp"))
    print(basepath)
