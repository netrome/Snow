import random
import json
from flask import Flask
from flask_cors import cross_origin, CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
@cross_origin()
def hello():
    return "Yo bro"

@app.route("/points")
@cross_origin()
def get_random_points():
    points = list(map(lambda _: tuple(map(lambda _: random.random() * 2 - 1, range(3))), range(1000)))
    out = json.dumps(points)
    return out


