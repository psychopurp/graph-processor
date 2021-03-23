from flask import Flask, render_template, redirect, send_from_directory, jsonify

from app import handler
import os
import shutil


# print(dir(handler), dir(__name__))
app = Flask(__name__, static_folder="../web/build/")
app.register_blueprint(handler.handler_print)


# @app.route("/", defaults={'path': ''})
# @app.route('/<path:path>')
# def home(path):
#     if path != "" and os.path.exists(app.static_folder + path):
#         return send_from_directory(app.static_folder, path)
#     else:
#         return send_from_directory(app.static_folder, 'index.html')
@app.route('/tmp/<path>')
def home(path):
    print(path)
    if path != "":
        print("mt")
        return send_from_directory('tmp/', path)


PORT = 8877


def create_app():

    # if __name__ == "__main__":
    # t1 = Thread(target=processor, args=("thread 1",))

    # t1.start()
    app.run(debug=False, port=PORT)
    basepath = os.path.dirname(__file__)
    if os.path.isdir(basepath+"/tmp"):
        shutil.rmtree(os.path.join(os.path.dirname(__file__), "tmp"))
        pass
