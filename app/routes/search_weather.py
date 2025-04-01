from flask import render_template, Blueprint
from app.services.callApis import callWeatherMap

bp = Blueprint("search_weather", __name__)

@bp.route("/search_weather/<string:state>/<string:city>")
def search_weather(state, city):
    response = callWeatherMap(state, city)
    
    return response