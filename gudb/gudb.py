import flask
from flask import Flask, render_template, request
from DB_Interface import *
import logging
import json

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

@app.route("/view")
def view():
    return render_template("view.html")

###
#  Request handlers
###

####    VIEW    ####
"""
Method to be used to get a list of all of the tables names
in the database
"""
@app.route("/_get_tables", methods=["GET"])
def _get_tables():
    return flask.jsonify(result=db_mgr.get_tables())

"""
Method to be used to get a list of the column names for a given
table
"""
@app.route("/_get_table_columns", methods=["GET"])
def _get_table_columns():
    table_name = request.args.get('table')
    
    # Query returns list with a bunch of info on the columns
    unformatted_info = db_mgr.get_table_columns(table_name)
    
    # We only want the names of the columns (the forth element)
    formatted_info = []
    for col in unformatted_info:
        formatted_info.append(col[3])

    return flask.jsonify(columns=formatted_info)


"""
Method to be used to get rows from the database with a given
list of filters
"""
@app.route("/_get_rows", methods=["GET"])
def _get_rows():
    filters = json.loads(request.args.get('filters'))

    #app.logger.debug(filters)

    # Send the info to the DB_Interface
    data = db_mgr.get_rows( \
        table_name = filters['selectTable'], \
        num_rows = (-1 if filters['selectTop'] == "" else filters['selectTop']), \
        where = filters['whereConditions'], \
        where_operators = filters['whereOperators'], \
        orderby = filters['orderBy'] \
    )
    return flask.jsonify(result=data)

"""
Method to be used to submit a written SQL query
"""
@app.route("/_send_query", methods=["POST"])
def _send_query():
    query = request.form.get('query')
    return flask.jsonify(result=db_mgr.submit_query(query))

"""
Method to be used to generate a SQL query given filter data
"""
@app.route("/_gen_query", methods=["GET"])
def _gen_query():
    filters = json.loads(request.args.get('filters'))

    # Send the info to the DB_Interface
    query = db_mgr.generate_sql( \
        table_name = filters['selectTable'], \
        num_rows = (-1 if filters['selectTop'] == "" else filters['selectTop']), \
        where = filters['whereConditions'], \
        where_operators = filters['whereOperators'], \
        orderby = filters['orderBy'] \
    )

    return flask.jsonify(result=query)


## For debugging
if app.debug:
    app.logger.setLevel(logging.DEBUG)

## Run the flask app
if __name__ == '__main__':
    #print(db_mgr.get_table_columns('alignments'))
    app.run(host='0.0.0.0', debug=True)