from flask import jsonify, Blueprint


handler_print = Blueprint("handler", __name__)


def response(st, msg, data):
    return jsonify({"st": st, "msg": msg, "data": data})


@handler_print.before_app_request
def check():
    print("before_print2")
