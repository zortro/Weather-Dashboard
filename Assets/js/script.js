const APIKey = '&APPID=c8ead7bb8d8694fdae3d05d6a3d405b1'
const units = '&units=imperial'
let searchHist = []

//getCity function
function getCity() {
    const weatherApi = 'https://api.openweathermap.org/data/2.5/weather?q='
    let input = document.getElementById('searchbar').value
    let queryUrl = weatherApi + input + units + APIKey
    let city = document.getElementById('city')
    let temp = document.getElementById('temp')
    let wind = document.getElementById('wind')
    let humidity = document.getElementById('humidity')
    
    //fetch city info based on input
    fetch(queryUrl)
    .then(function (response) {
        return response.json()
    })
    .then(function (today) {
        city.innerText = `${today.name}`
        temp.innerText = `Temperature: ${today.main.temp} °F`
        wind.innerText = `Wind: ${today.wind.speed} MPH`
        humidity.innerText = `Humidity: ${today.main.humidity}%`

        //uv objects
        let lat = today.coord.lat
        let lon = today.coord.lon
        let uv = document.getElementById('uv')
        const uvQuery = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}` + units + APIKey

        //fetch uv value
        fetch(uvQuery)
        .then(function (response) {
            return response.json()
        })
        .then(function (uvi) {
            uv.innerText = `UV Index: ${uvi.value}`
        })

        //forecast objects
        const forecastApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}`
        const forecastQuery = forecastApi + units + APIKey

        //fetch five day forecast
        fetch(forecastQuery)
        .then(function (response) {
            return response.json()
        })
        .then(function (forecast) {
            console.log(forecastQuery)
            $('#fCards').empty()
            //for every day
            for (let i = 1; i < 6; i++) {
                let fInfo = {
                    date: forecast.daily[i].dt,
                    icon: forecast.daily[i].weather[0].icon,
                    wind: forecast.daily[i].wind_speed,
                    temp: forecast.daily[i].temp.day,
                    humidity: forecast.daily[i].humidity
                }
                
                let dayName = moment(fInfo.date).format('MM/DD/YYYY')
                let iconURL = `<img src="https://openweathermap.org/img/w/${fInfo.icon}.png" alt="${forecast.daily[i].weather[0].main}" />`

                //create a card describing the forecast
                forecastCard = $(`            
                <div class="card">
                    <h3 class="card-text">${dayName}</h3>
                    <p class="card-text">${iconURL}</p>
                    <p class="card-text">${fInfo.temp} °F</p>
                    <p class="card-text">${fInfo.wind} MPH</p>
                    <p class="card-text">${fInfo.humidity}%</p>
                </div>`
                )  
            //append forecast card to container
            $('#fCards').append(forecastCard)
            }

        })
    })
}  

//searchbtn tst
$('#searchbtn').on('click', function(event) {
    event.preventDefault()
    
    let city = $('#searchbar').val().trim()
    getCity()
    if (!searchHist.includes(city)) {
        searchHist.push(city)
        let searchedCity = $(`
        <button class="btn city-btn">${city}</button>
        `)
        $('#recents').append(searchedCity)
    }
    
    //the city will be stored locally
    localStorage.setItem('city', JSON.stringify(searchHist))
    console.log(searchHist)
})

$('document').on('click', '.city-btn', function() {
    let searchHist = $(this).text()
    getCity(searchHist)
})

//the city local data will be displayed under search bar
$(document).ready(function() {
    let searchHist = JSON.parse(localStorage.getItem('city'))

    if (searchHist !== null) {
        let lastSearchIndex = searchHist.length - 1
        let lastSearchCity = searchHist[lastSearchIndex]
        getCity(lastSearchCity)
        console.log(`You last searched: ${lastSearchCity}`)
    }
})
