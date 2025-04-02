document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('city_form').addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        const city = data.city; // Asumiendo que tienes un campo state en tu formulario
        const country = data.country;

        fetch(`/search_weather/${city}/${country}`, {
            method: "GET"
        }).then(response => response.json())
        .then(data => {
            console.log(JSON.stringify(data));
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => {
        const userIP = data.ip;
        console.log("IP del usuario:", userIP);

        // Enviar la IP al backend de Flask
        fetch("/get-location", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ip: userIP }),
        })
          .then((response) => response.json())
          .then((locationData) => {
            console.log("Datos de ubicación:", locationData);

            var fixedcity = locationData.cityName.split(" (");
            console.log(fixedcity);

            document.getElementById('city').value = fixedcity[0];
            document.getElementById('country').value = locationData.countryCode;
            
          })
          .catch((error) => {
            console.error("Error al obtener la ubicación:", error);
          });
      })
      .catch((error) => {
        console.error("Error al obtener la IP:", error);
      });
});