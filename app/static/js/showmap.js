async function getApiKey(apiwanted) {
	// Function to get an API key from the Backend
	try {
		const response = await fetch(`/api/${apiwanted}`); // We specify the API Key we want
		const data = await response.json();
		console.log(`${apiwanted} API Key obtenida`);
		return data.token;
	} catch (error) {
		console.error(`Error al obtener la clave de API ${apiwanted}:`, error);
		return null;
	}
}

async function initializeMap() {
	// Function to initialize the map from MapBoxGL API
	try {
		// we get the api key of MapBox
		const mapboxToken = await getApiKey("MapBoxGL"); 
		if (!mapboxToken) {
			throw new Error("No se pudo obtener el token de MapBox");
		}

		mapboxgl.accessToken = mapboxToken; // We set the accesToken with API key we get before
	// we get the lat and lon
    var userLat = document.getElementById("lat").value
    var userLon = document.getElementById("lon").value

    console.log("User Latitude:", userLat, "User Longitude:", userLon) //print for debug

		const map = new mapboxgl.Map({
			// we create a map object for Mapbox
			container: "map",
			style: "mapbox://styles/mapbox/light-v11",
			center: [userLon, userLat],
			zoom: 8,
		});

		let currentLayer = "temp_new"; // Variable to save the actual layer of the map (Temperature as default)

		async function addWeatherLayer(layerType) {
			// Function to update the layer of the map
			if (!map.loaded()) {
				// Function to wait until the map is loaded
				await new Promise(resolve => {
					map.once("load", resolve);
				});
			}

			if (map.getSource("openweathermap")) {
				// This delete the layer if it exists
				map.removeLayer("openweathermap-layer");
				map.removeSource("openweathermap");
			}

			const apiKey = await getApiKey("OpenWeatherMap"); // We obtain the API key for OpenWeatherMap
			if (!apiKey) {
				console.error("No se pudo obtener la clave API de OpenWeatherMap");
				return;
			}

			map.addSource("openweathermap", {
				// We add a new source for OpenWeatherMap, where we change the layer we want
				type: "raster",
				tiles: [`https://tile.openweathermap.org/map/${layerType}/{z}/{x}/{y}.png?appid=${apiKey}`],
				tileSize: 256,
				attribution: "© OpenWeatherMap",
			});

			map.addLayer({
				// We add the layer with the source we add before
				id: "openweathermap-layer",
				type: "raster",
				source: "openweathermap",
				paint: {
					"raster-opacity": 0.8,
				},
			});
		}

		map.on("load", async function () {
			map.addControl(new mapboxgl.NavigationControl()); // This add navigation controls

			map.addControl( // This adds the option to geolocate the user
				new mapboxgl.GeolocateControl({
					positionOptions: {
						enableHighAccuracy: true,
					},
					trackUserLocation: true,
					showUserHeading: true,
				})
			);

			await addWeatherLayer(currentLayer); // This adds the current layer to the map

			// Detectar cambios en el selector de capas
			document.getElementById("layer-select").addEventListener("change", function (e) {
				currentLayer = e.target.value;
				addWeatherLayer(currentLayer);
			});
		});
	} catch (error) {
		console.error("Error al inicializar el mapa:", error);
		// Shows an error if the map didn't load
		document.getElementById("map").innerHTML = `<div class="p-5 text-red-600">Error al cargar el mapa: ${error.message}</div>`;
	}
}
