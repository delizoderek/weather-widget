let apiKey = "c876a0fbd7e38cd6fad7b774a04f718a";
let url = "https://api.openweathermap.org/data/2.5/weather?q=seattle&appid=c876a0fbd7e38cd6fad7b774a04f718a"
let searchBtn = document.querySelector("#city-search");
let cityInput = document.querySelector("#city-input");
let histList = document.querySelector("#search-history");

let history = [];

// Main Weather Container Variables
let todayWeather = {
    city: "",
    lat: 0,
    lon: 0,
    city_head: document.querySelector("#city-weath"),
    weather_icon: document.querySelector("#weather-image"),
    temp: document.querySelector("#currTemp"),
    wind: document.querySelector("#currSpeed"),
    humidity: document.querySelector("#currHumidity"),
    uvIdx: document.querySelector("#currIdx"),
}

// Object Used to hold the city information needed for an API call, when loading from local storage
let weatherStorage = {
    city: [],
    lat: [],
    lon: [],
}

// Entry function for getting the weather for a city
function getWeather(request){
    fetch(request)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        if(data.length){
            let latitude = data[0].lat;
            let longitude = data[0].lon;
            todayWeather.city = data[0].name;
            todayWeather.lat = latitude;
            todayWeather.lon = longitude;
            let onecallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly&limit=6&units=imperial&appid=${apiKey}`;
            onecallApi(onecallUrl);
        } else {
            alert('City not found');
        }
    });
}

// Handles the API call for the current weather and upcoming weather
function onecallApi(req){
    fetch(req)
    .then(function(resp){
        return resp.json();
    })
    .then(function(data){
        console.log(data);
        todayWeather.city_head.textContent = `${todayWeather.city} ${moment.unix(data.current.dt).format("MM/DD/YYYY")}`;
        todayWeather.weather_icon.setAttribute("src",`http://openweathermap.org/img/w/${data.current.weather[0].icon}.png`);
        todayWeather.temp.textContent = data.current.temp;
        todayWeather.wind.textContent = data.current.wind_speed;
        todayWeather.humidity.textContent = data.current.humidity;
        todayWeather.uvIdx.textContent = data.current.uvi;
        addToHistory(todayWeather.city);
        updateForecast(data.daily);
    });
}

// Updates the 5 day forecast objects
function updateForecast(forecast){
    for(let i = 1; i < 6; i++){
        let fDate = document.querySelector(`#date-${i-1}`);
        let fImg = document.querySelector(`#image-${i-1}`);
        let fTemp = document.querySelector(`#temp-${i-1}`);
        let fSpeed = document.querySelector(`#speed-${i-1}`);
        let fHumid = document.querySelector(`#humid-${i-1}`);
        fDate.textContent = moment.unix(forecast[i].dt).format("MM/DD/YYYY");
        fImg.setAttribute("src",`http://openweathermap.org/img/w/${forecast[i].weather[0].icon}.png`);
        fTemp.textContent = forecast[i].temp.day + " °F";
        fSpeed.textContent = forecast[i].wind_speed + " MPH";
        fHumid.textContent = forecast[i].humidity;
    }
}

// Displays the history buttons based on the elements in the array
function renderHistory(){
    for(let i = 0; i < history.length;i++){
        histList.append(history[i]);
    }
}

// Adds a city to the history array and updates the local storage
function addToHistory(cityName){
    if(!doesCityExist(cityName) && cityName !== ""){
        let histBtn = generateButton(cityName, todayWeather.lat, todayWeather.lon);
        weatherStorage.city.push(cityName);
        weatherStorage.lat.push(todayWeather.lat);
        weatherStorage.lon.push(todayWeather.lon);
        localStorage.setItem("historyButtons",JSON.stringify(weatherStorage));
        history.unshift(histBtn);
        if(history.length > 12){
            history.pop();
        }
        renderHistory();
    }
}

// Loads the array of weather objects from storage
function loadStorage(){
    let temp = JSON.parse(localStorage.getItem("historyButtons"));
    if(temp != null){
        for(let i = 0; i < temp.city.length; i++){
            history.unshift(generateButton(temp.city[i],temp.lat[i],temp.lon[i]));
        }
        if(history.length > 0){
            renderHistory();
        }
    }
}

// Returns a button that will be added to the history list
function generateButton(name, latitude, longitude){
    let tempBtn = document.createElement("button");
    tempBtn.textContent = name;
    tempBtn.setAttribute("class","m-2 btn btn-secondary");
    tempBtn.setAttribute("data-cityname",formatCityName(name));
    tempBtn.setAttribute("data-latitude",latitude);
    tempBtn.setAttribute("data-longitude",longitude);
    tempBtn.addEventListener("click",function(event){
        event.preventDefault();
        let onecallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly&limit=6&units=imperial&appid=${apiKey}`;
        todayWeather.city = name;
        onecallApi(onecallUrl);
    });
    return tempBtn;
}

// Checks the array to see if the city has already been added
function doesCityExist(city){
    let cityExist = false;
    for(let i = 0; i < history.length; i++){
        if(history[i].textContent === city){
            cityExist = true;
            break;
        }
    }
    return cityExist;
}

// Formats the city name for the API call
function formatCityName(cityString){
    if(cityString !== "" || cityString != null){
        cityString = cityString.trim();
        cityString = cityString.toLowerCase();
        if(cityString.includes(" ")){
            cityString = cityString.replaceAll(" ","+");
        }
        if(cityString.includes("-")){
            cityString = cityString.replaceAll("-","+");
        }
    } else {
        cityString = "-1";
    }

    return cityString;
}

// Event listener for when the search button is clicked.
// If the input string is empty, then an alert will be thrown else make a fetch request
searchBtn.addEventListener("click",function(event){
    event.preventDefault();
    let inputString = cityInput.value;
    inputString = formatCityName(inputString);
    if(inputString !== "-1"){
        let requestUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${inputString}&limit=1&appid=${apiKey}`;
        getWeather(requestUrl);
    } else {
        alert('please enter a search term');
    }
});

loadStorage();