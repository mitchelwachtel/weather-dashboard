var APIkey = "82d5daf2ee6f522b1b5e4b3cf21b2f07";
var lat;
var lon;
var city;
var units = "imperial";
var limit = 1;
var weatherUrl =
  "https://api.openweathermap.org/data/2.5/onecall?lat=" +
  lat +
  "&lon=" +
  lon +
  "&units=" +
  units +
  "&appid=" +
  APIkey;

var btnEl = $("#searchBtn");
var searchInputEl = $("#searchInput");
btnEl.on("click", search);
$('.past-searches').on("click", '.cityBtn', pastSearch);


function search(event) {
    event.preventDefault();
    event.stopPropagation();
  
    city = searchInputEl.val();
    var geocodingUrl =
      "http://api.openweathermap.org/geo/1.0/direct?q=" +
      city +
      "&limit=" +
      limit +
      "&appid=" +
      APIkey;
  
    console.log(city);
    findLatLon(geocodingUrl);
    
  }

function findLatLon(url) {
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      lat = data[0].lat;
      lon = data[0].lon;
      addButton(city);

    });
}

function addButton(city) {
    
    var a = $('<button>'+city+'</button>')
    a.attr("data-lat", lat).attr("data-lon", lon);
    a.addClass('cityBtn');
    $('.past-searches').append(a);
}

function pastSearch(event) {
    event.preventDefault();
    event.stopPropagation();
    lat = $(this).data().lat;
    lon = $(this).data().lon;
    console.log(lat);
    console.log(lon);
}

