from flask import render_template, Blueprint, current_app, jsonify
from app.services.callApis import callWeatherMap

bp = Blueprint("apis", __name__)

@bp.route("/api/<string:nameAPI>")
def getApibyName(nameAPI):
    match nameAPI:
        case "OpenWeatherMap":
            return jsonify({"token": current_app.config['OPEN_WEATHER_MAP_API_KEY']})
        case "WeatherAPI":
            return jsonify({"token": current_app.config['WEATHER_API_API_KEY']})
        case "MapBoxGL":
            return jsonify({"token": current_app.config['MAPBOX_ACCESS_TOKEN']})
        case "Geolocated":
            return jsonify({"token": current_app.config['GEOLOCATED_API_KEY']})
        case _:
            return {"error": "API not found"}, 404