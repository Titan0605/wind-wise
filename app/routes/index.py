from flask import render_template, Blueprint
from app.services.callApis import callWeatherMap

bp = Blueprint("index", __name__)

@bp.route("/")
def index():
    weather = callWeatherMap("Chihuahua","MX")
    return render_template("index.html", weather=weather)