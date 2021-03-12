from flask import jsonify, Blueprint
import task


handler_print = Blueprint("handler", __name__)


def response(st, msg, data):
    return jsonify({"st": st, "msg": msg, "data": data})


@handler_print.route("/api/getAnalyticjobs", methods=['GET'])
def getAnalyticJobs():
    return response(0, "", task.JobList)


@handler_print.route("/api/upload", methods=["POST"])
def uploadFile():
    pass


@handler_print.route("/api/createTask", methods=["POST"])
def createTask():
    pass


@handler_print.route("/api/getTasks", methods=["GET"])
def getTasks():
    pass


@handler_print.before_app_request
def check():
    print("before_print3")
