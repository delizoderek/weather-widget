let apiKey = "c876a0fbd7e38cd6fad7b774a04f718a";
let url = "https://api.openweathermap.org/data/2.5/weather?q=seattle&appid=c876a0fbd7e38cd6fad7b774a04f718a"
let searchBtn = document.querySelector("#city-search");
let cityInput = document.querySelector("#city-input");
let histList = document.querySelector("#search-history");

let history = [];
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
        if(data.length){
            let latitude = data[0].lat;
            let longitude = data[0].lon;
            todayWeather.city = data[0].name;
            let onecallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly&limit=6&units=imperial&appid=${apiKey}`;
            onecallApi(onecallUrl);
        } else {
            alert('City not found');
        }
    });
}

function onecallApi(req){
    fetch(req)
    .then(function(resp){
        return resp.json();
    })
    .then(function(data){
        todayWeather.city_head.textContent = `${todayWeather.city} ${moment.unix(data.current.dt).format("MM/DD/YYYY")}`;
        todayWeather.temp.textContent = data.current.temp;
        todayWeather.wind.textContent = data.current.wind_speed;
        todayWeather.humidity.textContent = data.current.humidity;
        todayWeather.uvIdx.textContent = data.current.uvi;
        addToHistory(todayWeather.city);
        updateForecast(data.daily);
    });
}

function updateForecast(forecast){
    for(let i = 1; i < 6; i++){
        let fDate = document.querySelector(`#date-${i-1}`)
        let fTemp = document.querySelector(`#temp-${i-1}`);
        let fSpeed = document.querySelector(`#speed-${i-1}`);
        let fHumid = document.querySelector(`#humid-${i-1}`);
        fDate.textContent = moment.unix(forecast[i].dt).format("MM/DD/YYYY");
        fTemp.textContent = forecast[i].temp.day + " °F";
        fSpeed.textContent = forecast[i].wind_speed + " MPH";
        fHumid.textContent = forecast[i].humidity;
    }
}

function renderHistory(){
    for(let i = 0; i < history.length;i++){
        histList.append(history[i]);
    }
}

function addToHistory(cityName){
    if(!doesCityExist(cityName)){
        let histBtn = document.createElement("button");
        histBtn.textContent = cityName;
        histBtn.setAttribute("data-cityname",formatCityName(cityName));
        histBtn.addEventListener("click",function(event){
            event.preventDefault();
            console.log(histBtn.dataset.cityname);
        });
        history.push(histBtn);
        renderHistory();
    }
}

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