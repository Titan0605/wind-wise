from flask import render_template, Blueprint, request, current_app, jsonify
from app.services.callApis import callWeatherMap
import requests

bp = Blueprint("search_weather", __name__)

@bp.route("/search_weather/<string:state>/<string:city>")
def search_weather(state, city):
    response = callWeatherMap(state, city)
    
    return response

@bp.route('/get-location', methods=['POST'])
def get_location():
    data = request.json
    user_ip = data.get('ip')
    
    if not user_ip:
        return jsonify({"error": "No se proporcionó IP"}), 400
    
    api_key = current_app.config["GEOLOCATED_API_KEY"]
    endpoint = f"https://us-west-1.geolocated.io/ip/{user_ip}?api-key={api_key}"
    
    try:
        response = requests.get(endpoint)
        response.raise_for_status()  # Verificar si hay errores en la respuesta
        location_data = response.json()
        return jsonify(location_data)
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500
