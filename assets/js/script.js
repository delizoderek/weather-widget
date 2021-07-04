let apiKey = "c876a0fbd7e38cd6fad7b774a04f718a";
let url = "https://api.openweathermap.org/data/2.5/weather?q=seattle&appid=c876a0fbd7e38cd6fad7b774a04f718a"
let searchBtn = document.querySelector("#city-search");
let cityInput = document.querySelector("#city-input");

// Main Weather Container Variables
let todayWeather = {
    city: "",
    city_head: document.querySelector("#city-weath"),
    temp: document.querySelector("#currTemp"),
    wind: document.querySelector("#currSpeed"),
    humidity: document.querySelector("#currHumidity"),
    uvIdx: document.querySelector("#currIdx"),
}

function getWeather(request){
    fetch(request)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        let latitude = data.city.coord.lat;
        let longitude = data.city.coord.lon;
        todayWeather.city = data.city.name;
        let onecallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=daily,minutely,hourly&units=imperial&appid=${apiKey}`;
        onecallApi(onecallUrl);
        console.log(data);

    });
}

function onecallApi(req){
    fetch(req)
    .then(function(resp){
        return resp.json();
    })
    .then(function(data){
        todayWeather.city_head.textContent = todayWeather.city;
        todayWeather.temp.textContent = data.current.temp;
        todayWeather.wind.textContent = data.current.wind_speed;
        todayWeather.humidity.textContent = data.current.humidity;
        todayWeather.uvIdx.textContent = data.current.uvi;
    });
}

searchBtn.addEventListener("click",function(event){
    event.preventDefault();
    let inputString = cityInput.value;
    if(inputString !== "" || inputString != null){
        inputString = inputString.toLowerCase();
        let requestUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${inputString}&units=imperial&cnt=5&appid=${apiKey}`;
        getWeather(requestUrl);
    } else {
        alert('please enter a search term');
    }
});