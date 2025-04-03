// Función para cargar datos del clima
async function loadWeatherData(userLat, userLon) {
	try {
		// makes a call to the API and is saved in response
		const response = await fetch(`/search_weather_WA/${userLat}/${userLon}`);
		if (!response.ok) {
			throw new Error("No se pudo obtener la información del clima");
		}
		// converts the response in JSON format and is saved in data
		const data = await response.json();
		console.log(data); // print for debug
		displayWeatherData(data);
	} catch (error) {
		console.error("Error:", error);
		document.getElementById("location-info").textContent = "Error al cargar datos";
	}
}

function displayWeatherData(data) {
	// we filled all the information provided by the api
	document.getElementById("location-info").textContent = `${data.location.name}, ${data.location.country}`;
	document.getElementById("current-temp").textContent = `${Math.round(data.current.temp_c)}°C`;
	document.getElementById("current-condition").textContent = data.current.condition.text;
	document.getElementById("current-icon").src = data.current.condition.icon;
	document.getElementById("last-updated").textContent = `Updated: ${formatTime(data.current.last_updated)}`;
	document.getElementById("feels-like").textContent = `${Math.round(data.current.feelslike_c)}°C`;
	document.getElementById("humidity").textContent = `${data.current.humidity}%`;
	document.getElementById("wind").textContent = `${data.current.wind_kph} km/h`;
	document.getElementById("visibility").textContent = `${data.current.vis_km} km`;

	const hourlyContainer = document.getElementById("hourly-forecast");
	hourlyContainer.innerHTML = "";

	const hours = data.forecast.forecastday[0].hour.concat(data.forecast.forecastday[1].hour);

	const currentHour = new Date().getHours();
	const nextHours = hours.slice(currentHour, currentHour + 24);

	console.log(nextHours);
	// shows the data in each hour
	nextHours.forEach(hour => {
		const date = new Date(hour.time);
		const hourCard = document.createElement("div");
		hourCard.className = "flex-shrink-0 text-center p-3 bg-indigo-50 rounded-lg min-w-20";
		hourCard.innerHTML = `
        <p class="text-xs font-semibold">${date.getHours()}:00</p>
        <img src="${hour.condition.icon}" alt="${hour.condition.text}" class="w-10 h-10 mx-auto my-1">
        <p class="text-md font-bold">${Math.round(hour.temp_c)}°C</p>
        <p class="text-xs text-gray-500">${hour.chance_of_rain}% <i class="fa-solid fa-droplet text-blue-400"></i></p>
    `;
		hourlyContainer.appendChild(hourCard);
	});

	const dailyContainer = document.getElementById("daily-forecast");
	dailyContainer.innerHTML = "";

	data.forecast.forecastday.forEach(day => {
		const date = new Date(day.date);
		const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		const dayCard = document.createElement("div");
		dayCard.className = "flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200";
		dayCard.innerHTML = `
        <div class="flex items-center">
            <div class="w-20 text-center">
                <p class="font-semibold">${dayNames[date.getDay()]}</p>
                <p class="text-xs text-gray-500">${date.getDate()}/${date.getMonth() + 1}</p>
            </div>
            <img src="${day.day.condition.icon}" alt="${day.day.condition.text}" class="w-10 h-10 mx-3">
            <div>
                <p class="text-sm">${day.day.condition.text}</p>
                <p class="text-xs text-gray-500">${day.day.daily_chance_of_rain}% rain prob.</p>
            </div>
        </div>
        <div class="text-right">
            <p class="font-semibold">Max: ${Math.round(day.day.maxtemp_c)}°C</p>
            <p class="text-gray-500">Min: ${Math.round(day.day.mintemp_c)}°C</p>
        </div>
    `;
		dailyContainer.appendChild(dayCard);
	});

	const alertsContainer = document.getElementById("alerts-container");
	const alertsSection = document.getElementById("weather-alerts");

	if (data.alerts && data.alerts.alert && data.alerts.alert.length > 0) {
		alertsSection.classList.remove("hidden");
		alertsContainer.innerHTML = "";

		data.alerts.alert.forEach(alert => {
			const alertCard = document.createElement("div");
			alertCard.className = "bg-red-50 border-l-4 border-red-500 p-3 mb-3 rounded";
			alertCard.innerHTML = `
            <div class="flex items-center mb-1">
                <i class="fa-solid fa-triangle-exclamation text-red-500 mr-2"></i>
                <p class="font-semibold text-red-700">${alert.event}</p>
            </div>
            <p class="text-sm text-gray-700">${alert.headline}</p>
            <p class="text-xs text-gray-500 mt-1">Vigente hasta: ${formatDate(alert.expires)}</p>
        `;
			alertsContainer.appendChild(alertCard);
		});
	} else {
		alertsSection.classList.add("hidden");
	}
}

function formatTime(dateStr) {
	const date = new Date(dateStr);
	return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(dateStr) {
	const date = new Date(dateStr);
	return date.toLocaleDateString("es-ES", {
		day: "numeric",
		month: "short",
		hour: "2-digit",
		minute: "2-digit",
	});
}

// Botón de actualizar
document.getElementById("refresh-btn").addEventListener("click", function () {
	const lat = document.getElementById("lat").value;
	const lon = document.getElementById("lon").value;

	loadWeatherData(lat, lon);
});