var APIkey = "82d5daf2ee6f522b1b5e4b3cf21b2f07";
var units = "imperial";
var limit = 1;
var saveArray = [];

var btnEl = $("#searchBtn");
var searchInputEl = $("#searchInput");
btnEl.on("click", createUrl);
$(".past-searches").on("click", ".cityBtn", pastSearch);

// grabbing the city that was input and creating the url to search for it's coordinates
function createUrl(event) {
  event.preventDefault();
  event.stopPropagation();

  var city = searchInputEl.val();
  var geocodingUrl =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&limit=" +
    limit +
    "&appid=" +
    APIkey;

  findLatLon(geocodingUrl);

  // Use url created to search for the cities Lat/Lon
  function findLatLon(url) {
    fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var lat = data[0].lat;
        var lon = data[0].lon;
        var state = data[0].state;

        for (i = 0; i < saveArray.length; i++) {
          if (city.toLowerCase() !== saveArray[i].city.toLowerCase()) {
            i++;
          } else {
            findWeather(city, state, lat, lon);
            return;
          }
        }

        var object = {
          lat: lat,
          lon: lon,
          state: state,
          city: city,
        };

        saveArray.push(object);
        localStorage.setItem("searches", JSON.stringify(saveArray));
        addButton(city, state, lat, lon);
        findWeather(city, state, lat, lon);
      });
  }
}

// Creating the button for past searches
function addButton(city, state, lat, lon) {
  var a = $("<button>" + city + "</button>");
  a.attr("data-lat", lat).attr("data-lon", lon).attr("data-state", state);
  a.addClass("cityBtn");
  $(".past-searches").append(a);
}

// Only for buttons of past searches
function pastSearch(event) {
  event.preventDefault();
  event.stopPropagation();
  var lat = $(this).data().lat;
  var lon = $(this).data().lon;
  var state = $(this).data().state;
  var city = $(this).text();

  findWeather(city, state, lat, lon);
}

//
//
//

// Next section: using the latitute/longitute found above to search for and display the weather

function findWeather(city, state, lat, lon) {
  var weatherUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=" +
    units +
    "&appid=" +
    APIkey;

  fetch(weatherUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // TODO: Next Step is to USE this data in order to display the Weather! LET'S GO!!!!
      console.log(data);
      populateCurrent(data, city, state);
      populateFiveDay(data);
    });
}

function populateCurrent(data, city, state) {
  $(".city-box").empty();
  var date = moment().format("dddd, MMM Do");

  var cityDiv = $("<div></div>");
  cityDiv.addClass("cityDiv");

  if (state == undefined) {
    var a = $("<h3>" + city + "</h3>");
    a.addClass("cityHeader");
    cityDiv.append(a);
  } else {
    var a = $("<h3>" + city + ", " + state + "</h3>");
    a.addClass("cityHeader");
    cityDiv.append(a);
  }

  var b = $("<h4>" + date + "</h4>");
  b.addClass("cityDate");
  cityDiv.append(b);

  $(".city-box").append(cityDiv);

  var icon = $("<img>");
  var iconCode = data.daily[0].weather[0].icon;
  var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
  icon.attr("src", iconUrl);
  $(".city-box").append(icon);

  var temp = data.current.temp;
  var c = $("<p>Temp: " + temp + "&deg;F</p>");
  $(".city-box").append(c);

  var wind = data.current.wind_speed;
  var d = $("<p>Wind: " + wind + " MPH</p>");
  $(".city-box").append(d);

  var humidity = data.current.humidity;
  var e = $("<p>Humidity: " + humidity + "%</p>");
  $(".city-box").append(e);

  var uvIndex = data.current.uvi;
  var f = $("<p>UV Index: <span>" + uvIndex + "</span></p>");
  f.find("span").addClass("uv");
  $(".city-box").append(f);

  //   Coloring uvIndex Value
  if (uvIndex < 3) {
    $(".uv").attr("style", "background: green; color: white");
  } else if (uvIndex < 6) {
    $(".uv").attr("style", "background: yellow");
  } else {
    $(".uv").attr("style", "background: red; color: white");
  }
}

function populateFiveDay(data) {
  $(".five-day").empty();

  for (i = 1; i <= 5; i++) {
    var card = $("<div></div>");
    card.addClass("card");

    var date = moment().add(i, "days").format("ddd, MMM Do");
    var a = $("<h5>" + date + "</h5>");
    card.append(a);

    var icon = $("<img>");
    var iconCode = data.daily[i].weather[0].icon;
    var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
    icon.attr("src", iconUrl);
    card.append(icon);

    var max = data.daily[i].temp.max;
    var b = $("<p>Hi: " + max + "&deg;F</p>");
    card.append(b);

    var min = data.daily[i].temp.min;
    var c = $("<p>Lo: " + min + "&deg;F</p>");
    card.append(c);

    var wind = data.daily[i].wind_speed;
    var d = $("<p>Wind: " + wind + " MPH</p>");
    card.append(d);

    var hum = data.daily[i].humidity;
    var e = $("<p>Humidity: " + hum + "%</p>");
    card.append(e);

    $(".five-day").append(card);
  }
}

function useStorage() {
  if (localStorage.getItem("searches") !== null) {
    var y = localStorage.getItem("searches");
    saveArray = JSON.parse(y);

    for (i = 0; i < saveArray.length; i++) {
      var lat = saveArray[i].lat;
      var lon = saveArray[i].lon;
      var city = saveArray[i].city;
      var state = saveArray[i].state;

      addButton(city, state, lat, lon);
    }
    var z = saveArray.length - 1;
    var latz = saveArray[z].lat;
    var lonz = saveArray[z].lon;
    var cityz = saveArray[z].city;
    var statez = saveArray[z].state;

    findWeather(cityz, statez, latz, lonz);
  } else {
    findWeather("Atlanta", "Georgia", "33.749", "-84.3903");
  }
}
