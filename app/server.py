from flask import Flask, render_template, redirect, send_from_directory, jsonify

import handler
import task

# print(dir(handler), dir(__name__))
app = Flask(__name__, static_folder="../web/build/static",
            template_folder="../web/build")
app.register_blueprint(handler.handler_print)


@app.route("/", defaults={'path': ''})
@app.route('/<path:path>')
def main(path):
    return render_template('index.html')


@app.route("/api/getAnalyticjobs", methods=['GET'])
def getAnalyticJobs():
    return handler.response(0, "", task.JobList)


if __name__ == "__main__":
    app.run(debug=False, port=3366)
