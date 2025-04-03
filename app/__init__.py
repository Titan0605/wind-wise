import os
from flask import Flask
# from mapkick.flask import mapkick_blueprint
from config import Config
from app.routes import index, search_weather, getAPIs
from dotenv import load_dotenv

def create_app(config = Config):
    load_dotenv()
    
    app = Flask(__name__)
    
    app.config.from_object(config)
        
    app.config["MAPBOX_ACCESS_TOKEN"] = os.environ.get("MAPBOX_ACCESS_TOKEN")
    app.config["WEATHER_API_API_KEY"] = os.environ.get("WEATHER_API_API_KEY")
    app.config["GEOLOCATED_API_KEY"] = os.environ.get("GEOLOCATED_API_KEY")
    app.config["OPEN_WEATHER_MAP_API_KEY"] = os.environ.get("OPEN_WEATHER_MAP_API_KEY")
    
    app.register_blueprint(index.bp)
    app.register_blueprint(search_weather.bp)
    app.register_blueprint(getAPIs.bp)
    
    return app
