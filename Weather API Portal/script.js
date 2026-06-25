function showMessage(msg){
    document.getElementById("description").textContent = msg;
}
const API_KEY = "812f48f21a9f8a20fc84aef0dad9036a";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if(city) getWeatherByCity(city);
});

locationBtn.addEventListener("click", getLocationWeather);

async function getWeatherByCity(city){

    document.getElementById("cityName").textContent = "Loading...";
    document.getElementById("temperature").textContent = "--";
    document.getElementById("weatherIcon").src =
"https://openweathermap.org/img/wn/01d@4x.png";

    try{

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        const data = await response.json();

        if(data.cod != 200){
            alert("City not found");
            return;
        }

        displayWeather(data);

    }catch(error){
        alert("Network error");
    }
}

function getLocationWeather(){

    document.getElementById("cityName").textContent =
    "Detecting location...";

    if(!navigator.geolocation){

        showMessage("Geolocation not supported. Using fallback city.");

        getWeatherByCity("Addis Ababa");
        return;
    }

    navigator.geolocation.getCurrentPosition(

        async(position)=>{

            try{

                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
                );

                const data = await response.json();
                displayWeather(data);

            }catch(error){

                showMessage("Location fetch failed. Using fallback city.");
                getWeatherByCity("Addis Ababa");
            }

        },

        (error)=>{

            console.log("Geo error:", error);

            // FALLBACK SYSTEM (IMPORTANT)
            showMessage("Location blocked. Showing default city weather.");

            getWeatherByCity("Addis Ababa");

        },

        {
            enableHighAccuracy: false,
            timeout: 8000,
            maximumAge: 0
        }

    );
}

/* =========================
   DISPLAY FUNCTION
   ========================= */

function displayWeather(data){

    document.getElementById("cityName").textContent =
        `${data.name}, ${data.sys.country}`;

    document.getElementById("temperature").textContent =
        `${Math.round(data.main.temp)}°C`;

    document.getElementById("description").textContent =
        data.weather[0].description;

    document.getElementById("humidity").textContent =
        data.main.humidity;

    document.getElementById("wind").textContent =
        data.wind.speed;

    document.getElementById("feelsLike").textContent =
        Math.round(data.main.feels_like);

    document.getElementById("pressure").textContent =
        data.main.pressure;

    const icon = data.weather[0].icon;

    document.getElementById("weatherIcon").src =
        `https://openweathermap.org/img/wn/${icon}@4x.png`;
}
window.addEventListener("load", () => {
    getWeatherByCity("Addis Ababa");
});
