document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('city_form').addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);

            const state = data.state; // Asumiendo que tienes un campo state en tu formulario
            const city = data.city;

            try{
                const response = await fetch(`/search_weather/${state}/${city}`, {
                    method: "GET"
                    // No se incluye body en GET
                });

                alert(JSON.stringify(response));
            }
            catch(e) {}
        })
    
});