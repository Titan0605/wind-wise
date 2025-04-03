document.addEventListener("DOMContentLoaded", function () {
	// When the DOM is loaded it will do the code
	fetch("https://api.ipify.org?format=json") // Call an API to get the user's IP
		.then(response => response.json())
		.then(data => {
			const userIP = data.ip;
			console.log("IP del usuario:", userIP); // Show the IP for debug

			// Enviar la IP al backend de Flask
			fetch("/get-location", {
				// Fetch the location based on the user's IP, with a Flask route
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ ip: userIP }), // We send the IP
			})
				.then(response => response.json())
				.then(locationData => {
					console.log("Datos de ubicación:", locationData); // Show the location data for debug

					var fixedcity = locationData.cityName.split(" ("); // We split the city's name in two to show it correctly
					console.log(fixedcity); // Show the city for debug

					getCoordinates(fixedcity[0], locationData.countryCode);

					if (document.getElementById("city") && document.getElementById("country")) {
						document.getElementById("city").value = fixedcity[0];
						document.getElementById("country").value = locationData.countryCode;
					}

					document.getElementById("lat").value = locationData.latitude;
					document.getElementById("lon").value = locationData.longitude;
					console.log("Latitud:", locationData.latitude, "Longitud:", locationData.longitude);
				})
				.catch(error => {
					console.error("Error al obtener la ubicación:", error); // In case an error occurs, it will show the error
				});
		})
		.catch(error => {
			console.error("Error al obtener la IP:", error); // In case we can't get the IP it will show an error
		});

	document.getElementById("city_form").addEventListener("submit", async function (e) {
		// Function to execute when the submit is done
		e.preventDefault();

		var formData = new FormData(e.target);
		var data = Object.fromEntries(formData);

		console.log(data);

		var city = data.city;
		var country = data.country;

		var location = await getCoordinates(city, country);

		console.log(location);

		console.log(location.coord.lat);

		document.getElementById("lat").value = location.coord.lat;
		document.getElementById("lon").value = location.coord.lon;

    initializeMap();
		loadWeatherData(location.coord.lat, location.coord.lon);

		document.getElementById("weather-dashboard").style.display = "block";
		document.getElementById("map-container").style.display = "block";
    document.getElementById("error-message").style.display = "none";
	});
});

async function getCoordinates(city, country) {
	try {
		const response = await fetch(`/search_weather_WM/${city}/${country}`);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error al obtener las coordenadas", error);
    document.getElementById("weather-dashboard").style.display = "none";
		document.getElementById("map-container").style.display = "none";
    document.getElementById("error-message").style.display = "block";
		return null;
	}
}
