import flask
from flask import Flask, render_template, request
from DB_Interface import *
import logging

###
#  Initialize globals
###
DB_NAME = 'starfinder'
app = Flask(__name__)
db_mgr = DB_Interface(DB_NAME)

###
#  Pages routes
###
@app.route("/")
@app.route("/index")
def index():
    return render_template("index.html")

###
#  Request handlers
###
@app.route("/_get_tables", methods=["GET"])
def _get_tables():
    return flask.jsonify(result=db_mgr.get_tables())

@app.route("/_get_rows", methods=["GET"])
def _get_rows():
    table_name = request.args.get('table')
    num_rows = request.args.get('num_rows')
    if (num_rows == 'all'):
        result = db_mgr.get_rows(table_name)
    else:
        result = db_mgr.get_rows(table_name, num_rows)

    return flask.jsonify(result=result)

## For debugging
if app.debug:
    app.logger.setLevel(logging.DEBUG)

## Run the flask app
if __name__ == '__main__':
    # print(db_mgr.get_rows('alignments'))
    app.run(host='0.0.0.0', debug=True)