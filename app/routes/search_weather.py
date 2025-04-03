from flask import Blueprint, request, current_app, jsonify
from app.services.callApis import callWeatherMap, callWeatherApi
import requests

bp = Blueprint("search_weather", __name__)

# recieves a city name and a country name as parameters
@bp.route("/search_weather_WM/<string:city>/<string:country>")
def search_weather(city, country):
    # calls the api with the city and country written by the user
    response = callWeatherMap(city, country)
    # returns the response un json format
    return jsonify(response)


@bp.route("/search_weather_WA/<string:lat>/<string:lon>")
def search_weather_WA(lat, lon):
    response = callWeatherApi(lat, lon)

    return jsonify(response)

# gets the location
@bp.route('/get-location', methods=['POST'])
def get_location():
    # in data saves the body provided by the fetch in the js
    data = request.json
    # from data gets the IP
    user_ip = data.get('ip')
    # If there it not an IP returns an error
    if not user_ip:
        return jsonify({"error": "No se proporcionó IP"}), 400
    # gets the api key 
    api_key = current_app.config["GEOLOCATED_API_KEY"]
    # creates the endpoint 
    endpoint = f"https://us-west-1.geolocated.io/ip/{user_ip}?api-key={api_key}"
    
    try:
        # makes a call to the api and is saved the response
        response = requests.get(endpoint)
        # in case something happens it will give us the status code
        response.raise_for_status()
        # the response is saved in json format
        location_data = response.json()
        # returns the response in json format
        return jsonify(location_data)
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500
