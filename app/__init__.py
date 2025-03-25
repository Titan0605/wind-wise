import os
from flask import Flask
# from mapkick.flask import mapkick_blueprint
from config import Config
from app.routes import index
from dotenv import load_dotenv

def create_app(config = Config):
    load_dotenv()
    
    app = Flask(__name__)
    
    app.config.from_object(config)
        
    # app.config["MAPBOX_ACCESS_TOKEN"] = os.environ.get("MAPBOX_TOKEN")
    
    app.register_blueprint(index.bp)
    
    return app
