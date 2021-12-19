// Open-Weather-Map: API key (Global Variable)
var apiKey = "7134337f8bd4fd3058beddffe88a0d25";

// function to search current weather of searched city 
function searchCity(event){
    event.preventDefault();
    var cityInput = $("#searchcity").val();
    
    if(cityInput === "")
    {
        return;
    } 
   
    searchCurrentWeather(cityInput);
    
    populateSearchHistory(cityInput);
    
    $("#searchcity").val("");
}

// Fetch Current Weather API 
function searchCurrentWeather(city){

    var searchQueryURL = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+ apiKey; 

    // GET Current Weather
    $.ajax({
        url: searchQueryURL,
        method: "GET"
    }).then(function(response){
        
        // Log the queryURL
        console.log("Search Query URL : "+searchQueryURL);

        // Kelvin ---> Fahrenheit
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;

        // Kelvin ---> Celsius   
        var tempC = (response.main.temp - 273.15);

        var currentDate = new Date().toLocaleDateString();
     
        var latitude = response.coord.lat;
        var longitude = response.coord.lon;
        
        // UVI API url
        var uvQueryURL = "https://api.openweathermap.org/data/2.5/uvi?lat="+latitude+"&lon="+longitude+"&appid="+ apiKey;

        var cityId = response.id;
        // 5 Day Forecast API url
        var forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id="+cityId+"&units=imperial&appid="+apiKey;
          
        $("#city-card").show();
        
        $("#temperature").text("Temperature : "+tempF.toFixed(2)+" °F/ "+tempC.toFixed(2)+"°C"); //SHIFT OPTION 8 for degree symbol
        $("#humidity").text("Humidity : "+response.main.humidity+" %");
        $("#windspeed").text("Wind Speed : "+response.wind.speed+" MPH");
        // Image icon for Current Weather (city-card)
        var imageIcon = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + response.weather[0].icon.toString() + ".png");

        $("#city-name").text(response.name + " ("+currentDate+") ").append(imageIcon);

        getUVIndex(uvQueryURL); 

        showForecast(forecastQueryURL);
        
    });   

}

//  **********   Get UVI  
function getUVIndex(uvQueryURL){

    console.log("UV query URL : "+uvQueryURL);
    
    $.ajax({       
        url: uvQueryURL,
        method: "GET"
    })
}
    // **********  Need Uvi Responce   ************
    


// 5 Day Forecast 
function showForecast(forecastQueryURL){

    var temp, humidity, icon;

    console.log("Forecast query URL : "+forecastQueryURL);

    $("#5DayForecast").show();

    $.ajax({    
        url: forecastQueryURL,
        method: "GET"
    })
    .then(function(forecastResponse){

        $("#forecast").empty();
        var list = forecastResponse.list;

        for(var i = 0 ; i < list.length ;i++){
            
            var date = list[i].dt_txt.split(" ")[0];
            var dateArr = date.split("-");
            
            var dateForecast = dateArr[1]+"/"+dateArr[2]+"/"+dateArr[0];
            var time = list[i].dt_txt.split(" ")[1];

            if(time === "12:00:00"){

                temp = list[i].main.temp;
                humidity = list[i].main.humidity;
                icon = list[i].weather[0].icon;

                var card = $("<div>").addClass("card bg-primary text-white");
                var cardBody = $("<div>").addClass("card-body");
                
                var fDate = $("<h5>").addClass("card-text").text(dateForecast);
                
                // https://openweathermap.org/img/wn/10d.png
                var imgIcon = $("<img>").attr("src","https://openweathermap.org/img/wn/" + icon + ".png"); 
                
                var tempP  = $("<p>").addClass("card-text").text("Temp: " +temp+ "°F");
                
                var humidityP = $("<p>").addClass("card-text").text("Humidity : " +humidity+ " % ");

                cardBody.append(fDate, imgIcon, tempP, humidityP);
                card.append(cardBody);

                $("#forecast").append(card);
            }
       
        }
    });
}

// ********* SetItem in local storage and GetItem to populate search history  *******


// *********  City search history. click to load weather ********


// Execute script when html is fully loaded
$(document).ready(function(){

    $("#searchButton").on("click",searchCity);

    // ******  Get "history" form local storage  *****
    // ******  Add listitem class for history[i]  *****
    // ******  Append to "#historyList"  ******
    var history = JSON.parse(localStorage.getItem("history"));  
    
    if (history) {
        var lastSearchedCity = history[0];  //takes last searched city from localstorage
        searchCurrentWeather(lastSearchedCity); //loads last searched city's weather

        for(var i = 0 ; i < history.length; i++){
            //Gets Search history from local storage and populates in HTML
            var listitem = $("<li>").addClass("list-group-item previousCity").text(history[i]);  
            $("#historylist").append(listitem);            
        }
    } else {
        $("#city-card").hide();
        $("#5DayForecast").hide();
    }
});
