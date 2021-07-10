from flask import Flask
from flask_restful import Resource, Api
import json
import logging

###
#  Initialize the flask app
###
app = Flask(__name__)
api = Api(app)

###
#  Helper functions
###
def get_json_contents(path):
    try:
        with open(path, 'r') as f:
            content = json.load(f)
        return content
    except OSError:
        return f"Error: File {path} does not exist or cannot be opened"


###
#  Endpoint implementation
###
class alignments(Resource):
    def get(self):
        return get_json_contents("testinfo.json")
        


###
#  List of endpoints
###
api.add_resource(alignments, "/alignments")


## For debugging 
if app.debug:
    app.logger.setLevel(logging.DEBUG)

## Run the flask app
if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)


