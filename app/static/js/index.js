document.addEventListener("DOMContentLoaded", function () {
	// When the DOM is loaded it will do the code
	fetch("https://api.ipify.org?format=json") // Call an API to get the user's IP
		.then(response => response.json())
		.then(data => {
			// saves the IP of the user
			const userIP = data.ip;
			console.log("IP del usuario:", userIP); // Show the IP for debug

			// sends the IP to the endpoint to get the latitude and longitude of the IP
			fetch("/get-location", {
				// Fetch the location based on the user's IP, with a Flask route
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ ip: userIP }), // We send the IP in json format
			})
				.then(response => response.json())
				.then(locationData => {
					console.log("Datos de ubicación:", locationData); // Show the location data for debug

					var fixedcity = locationData.cityName.split(" ("); // We split the city's name in two to show it correctly, examplre respone: (Chihuahua City (Zona centro))
					console.log(fixedcity); // Show the city for debug, example correction: (Chihuahua City)

					getCoordinates(fixedcity[0], locationData.countryCode);

					if (document.getElementById("city") && document.getElementById("country")) {
						// fills the city input with the name of the city founded 
						document.getElementById("city").value = fixedcity[0];
						// fills the country input with the code of the country founded 
						document.getElementById("country").value = locationData.countryCode;
					}

					// inserts the latitude and longitude returned by the api get-location
					document.getElementById("lat").value = locationData.latitude;
					document.getElementById("lon").value = locationData.longitude;
					console.log("Latitud:", locationData.latitude, "Longitud:", locationData.longitude); //pints the lat and lon by for debug
				})
				.catch(error => {
					console.error("Error al obtener la ubicación:", error); // In case an error occurs, it will show the error
				});
		})
		.catch(error => {
			console.error("Error al obtener la IP:", error); // In case we can't get the IP it will show an error
		});

	// Function to execute when the submit is clicked
	document.getElementById("city_form").addEventListener("submit", async function (e) {
		// prevents the default functionality
		e.preventDefault();
		// saves the info of the inputs
		var formData = new FormData(e.target);
		var data = Object.fromEntries(formData);

		console.log(data); // prints the data for debug
		// saves each value in independent variables
		var city = data.city;
		var country = data.country;

		// gets the coords of the specific place
		var location = await getCoordinates(city, country);

		console.log(location);// prints the location for debug

		console.log(location.coord.lat);
		
		// inserts the latitude and longitude returned by the api get-location
		document.getElementById("lat").value = location.coord.lat;
		document.getElementById("lon").value = location.coord.lon;

    initializeMap();
		loadWeatherData(location.coord.lat, location.coord.lon);

		document.getElementById("weather-dashboard").style.display = "block";
		document.getElementById("map-container").style.display = "block";
    document.getElementById("error-message").style.display = "none";
	});
});

// 
async function getCoordinates(city, country) {
	try {
		// makes a call to the API's endpoint with city and country like parameters and saved in response
		const response = await fetch(`/search_weather_WM/${city}/${country}`);
		// the response is converted to JSON format and saved in data
		const data = await response.json();
		// return the data
		return data;
	} catch (error) {
		// if there was an error in the call, the inputs are filled with empty information
		console.error("Error al obtener las coordenadas", error);
    document.getElementById("weather-dashboard").style.display = "none";
		document.getElementById("map-container").style.display = "none";
    document.getElementById("error-message").style.display = "block";
		return null;
	}
}
