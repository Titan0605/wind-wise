// Función para obtener la clave API
async function getWeatherApiKey(apiwanted) {
  try {
    const response = await fetch(`/api/${apiwanted}`);
    const data = await response.json();
    console.log(`${apiwanted} API Key obtenida`);
    return data.token;
  } catch (error) {
    console.error(`Error al obtener la clave de API ${apiwanted}:`, error);
    return null;
  }
}

// Función principal para inicializar todo
async function initializeMap() {
  try {
    // Primero obtenemos el token de MapBox
    const mapboxToken = await getWeatherApiKey("MapBoxGL");
    if (!mapboxToken) {
      throw new Error("No se pudo obtener el token de MapBox");
    }

    // Establecemos el token antes de crear el mapa
    mapboxgl.accessToken = mapboxToken;

    // Ahora creamos el mapa
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/light-v11",
      center: [-106.077, 28.636],
      zoom: 10,
    });

    // Variable para almacenar la capa actual
    let currentLayer = "temp_new";

    // Función para añadir capa meteorológica
    async function addWeatherLayer(layerType) {
      // Esperar a que el mapa esté cargado
      if (!map.loaded()) {
        await new Promise((resolve) => {
          map.once("load", resolve);
        });
      }

      // Eliminar capa anterior si existe
      if (map.getSource("openweathermap")) {
        map.removeLayer("openweathermap-layer");
        map.removeSource("openweathermap");
      }

      // Obtener la clave API antes de continuar
      const apiKey = await getWeatherApiKey("OpenWeatherMap");
      if (!apiKey) {
        console.error("No se pudo obtener la clave API de OpenWeatherMap");
        return;
      }

      // Añadir nueva capa
      map.addSource("openweathermap", {
        type: "raster",
        tiles: [`https://tile.openweathermap.org/map/${layerType}/{z}/{x}/{y}.png?appid=${apiKey}`],
        tileSize: 256,
        attribution: "© OpenWeatherMap",
      });

      map.addLayer({
        id: "openweathermap-layer",
        type: "raster",
        source: "openweathermap",
        paint: {
          "raster-opacity": 0.8,
        },
      });
    }

    // Unificamos la lógica de carga en un solo manejador
    map.on("load", async function () {
      // Agregar controles de navegación
      map.addControl(new mapboxgl.NavigationControl());

      // Agregar control de geolocalización
      map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
          showUserHeading: true,
        })
      );

      // Intentar geolocalizar al usuario
      navigator.geolocation.getCurrentPosition(
        (position) => {
          map.flyTo({
            center: [position.coords.longitude, position.coords.latitude],
            zoom: 8,
          });
        },
        (error) => {
          console.log("Error obteniendo la geolocalización:", error);
        }
      );

      // Agregar capa inicial (temperatura)
      await addWeatherLayer(currentLayer);

      // Detectar cambios en el selector de capas
      document.getElementById("layer-select").addEventListener("change", function (e) {
        currentLayer = e.target.value;
        addWeatherLayer(currentLayer);
      });
    });
  } catch (error) {
    console.error("Error al inicializar el mapa:", error);
    // Mostrar mensaje al usuario
    document.getElementById("map").innerHTML = `<div style="padding: 20px; color: red;">Error al cargar el mapa: ${error.message}</div>`;
  }
}

// Iniciar todo el proceso cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", initializeMap);
