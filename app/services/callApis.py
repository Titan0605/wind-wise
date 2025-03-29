from flask import current_app # we import current_app to get the app we create at the moment we run flask to get the API KEY in the config
import requests # request is to make a request to an API

def callWeatherMap(city, country): 
    """ Function to make a call to OpenWeatherMap """
    # We call the API and insert the info city, country and the API KEY from the config
    response = requests.get(f"https://api.openweathermap.org/data/2.5/weather?q={city},{country}&appid={current_app.config["OPEN_WEATHER_MAP_API_KEY"]}&units=metric")
    response.raise_for_status() # This is for in case something happens it will give us the status code

    weatherMap = response.json() # This converts the response in JSON

    print(weatherMap) # Print for debug

    return weatherMap # Return the JSON

def callWeatherApi(city):
    """ Function to make a call to WeatherApi """
    # We call the API and insert the info city, country and the API KEY from the config
    response = requests.get(f"https://api.weatherapi.com/v1/current.json?key={current_app.config["WEATHER_API_API_KEY"]}&q={city}&aqi=no")
    response.raise_for_status() # This is for in case something happens it will give us the status code

    weatherApi = response.json() # This converts the response in JSON

    print(weatherApi) # Print for debug

    return weatherApi # Return the JSON