const API_KEY = "45123354725da7a4dff65cc78347d934";
const userTab = document.querySelector(".user-tab");
const searchTab = document.querySelector(".search-tab");

const searchBar = document.querySelector(".search-bar-container");
const grantLocationContainer = document.querySelector(".grant-location-container");
const loadingDisplay = document.querySelector(".loading-container");
const mainDisplay = document.querySelector(".weather-information-container");
let currentTab = userTab;
currentTab.classList.add("current-tab");
getfromSessionStorage();

userTab.addEventListener('click',()=>{
    switchTab(userTab);
});
searchTab.addEventListener('click',()=>{
    switchTab(searchTab);
});


function switchTab(newTab){
    if(currentTab == newTab) return;
    currentTab.classList.remove("current-tab");
    currentTab = newTab;
    currentTab.classList.add("current-tab");
    if(searchTab.classList.contains("current-tab")){
        grantLocationContainer.classList.remove("active");
        mainDisplay.classList.remove("active");
        searchBar.classList.add("active");        
    }else{
        searchBar.classList.remove("active");
        mainDisplay.classList.remove("active");
        getfromSessionStorage();
    }
}

function getfromSessionStorage(){                                      
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantLocationContainer.classList.add("active");
    }else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat ,lon} = coordinates;
    grantLocationContainer.classList.remove("active");
    loadingDisplay.classList.add("active");
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingDisplay.classList.remove("active");
        mainDisplay.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        loadingDisplay.classList.remove("active");
        grantLocationContainer.classList.add("active");
        alert("Unable to fetch data");
    }
}

function renderWeatherInfo(data){
    const cityName = document.querySelector(".city-name");
    const countryIcon = document.querySelector(".country-icon");
    const desc = document.querySelector(".weather-description");
    const weatherIcon = document.querySelector(".weather-icon");
    const temp = document.querySelector(".temperature");
    const windspeed = document.querySelector(".wind-value");
    const humidity = document.querySelector(".humidity-value");
    const clouds = document.querySelector(".clouds-value");
    
    cityName.innerText = data?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    desc.innerText = data?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temp.innerText = `${data?.main?.temp} °C`;
    windspeed.innerText = `${data?.wind?.speed} m/s`;
    humidity.innerText = `${data?.main?.humidity}%`;
    clouds.innerText = `${data?.clouds?.all}%`;
}


const grantAccess = document.querySelector(".grant-button");
grantAccess.addEventListener('click',getLocation);


function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("No geolocation support available");
    }
}

function showPosition(position){
    const userCoordinates = {
        lat : position.coords.latitude,
        lon : position.coords.longitude
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const searchInput = document.querySelector("[data-searchInput]");



searchBar.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;
    
    if(cityName === ""){
        return;
    }
    else {
        fetchSearchWeatherInfo(cityName);
    }
});

async function fetchSearchWeatherInfo(city) {
    loadingDisplay.classList.add("active");
    mainDisplay.classList.remove("active");
    // grantLocationContainer.classList.remove("active");
    
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        console.log(data);
        loadingDisplay.classList.remove("active");
        mainDisplay.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        alert("Error");
    }
}
