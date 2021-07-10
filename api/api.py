from flask import Flask
from flask_restful import Resource, Api
import logging

###
#  Initialize the flask app
###
app = Flask(__name__)
api = Api(app)

class test(Resource):
    def get(self):
        return "Hello world"

###
#  Endpoints
###
api.add_resource(test, "/", "/test")


## For debugging 
if app.debug:
    app.logger.setLevel(logging.DEBUG)

## Run the flask app
if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)


