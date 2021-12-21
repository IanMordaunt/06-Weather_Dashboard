// Open-Weather-Map: API key (Global Variable)
var apiKey = "7134337f8bd4fd3058beddffe88a0d25";

// var history = [];

// function to search current weather of searched city 
function searchCity(event){
    event.preventDefault();
    var cityInput = $("#searchcity").val();
    
    if(cityInput === "")
    {
        return;
    } 
   
    searchCurrentWeather(cityInput);
    
    $("#searchcity").val("");
}

// Fetch Current Weather API 
function searchCurrentWeather(city){

    var searchQueryURL = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+ apiKey; 
   searchHistory(city)
    // GET Current Weather
    $.ajax({
        url: searchQueryURL,
        method: "GET"
    }).then(function(response){
        
        // Log the queryURL
        console.log(searchQueryURL);

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
        
        $("#temperature").text("Temperature : "+tempF.toFixed(2)+" °F/ "+tempC.toFixed(2)+"°C"); 
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
     .then(function(uvResponse) {
         var uvi = uvResponse.value;
         var uvButton = $("<button>").text("UV-Index: " + uvi)

         if(uvi <= 3) {
             uvButton.addClass("btn-success")
         }else if(uvi <= 7) {
             uvButton.addClass("btn-warning")
         }else {
             uvButton.addClass("btn-danger")
         }
         $("#uvindex").html("")
         $("#uvindex").append(uvButton)
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

                var forecastCard = $("<div>").addClass("card bg-primary text-white");
                var forecastCardBody = $("<div>").addClass("card-body");
                
                var forecastDate = $("<h5>").addClass("card-text").text(dateForecast);
                
   
                var iconImg = $("<img>").attr("src","https://openweathermap.org/img/wn/" + icon + ".png"); 
                
                var forecastTemp  = $("<p>").addClass("card-text").text("Temp: " +temp+ "°F");
                
                var forecastHumidity = $("<p>").addClass("card-text").text("Humidity : " +humidity+ " % ");

                forecastCardBody.append(forecastDate, iconImg, forecastTemp, forecastHumidity);
                forecastCard.append(forecastCardBody);

                $("#forecast").append(forecastCard);
            }
        }
    });
}



// ********* SetItem in local storage and GetItem to populate search history  *******
function searchHistory(city) {
  
    // history.push(city)
    // console.log(history)
    // localStorage.setItem("history", JSON.stringify(history))
   
}

// *********  City search history. click to load weather ********



    $(".input-group").on("submit",searchCity);

    // ******  Get "history" form local storage  *****
    // ******  Add listitem class for history[i]  *****
    // ******  Append to "#historyList"  ******
    

