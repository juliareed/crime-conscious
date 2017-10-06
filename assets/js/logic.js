// Crimes by date:
var startdate = "2017-09-21";
var enddate = "2017-09-22";

var datequeryURL = "https://data.cityofchicago.org/resource/6zsd-86xi.json?$where=date%20between%20%27" + startdate + "%27%20and%20%27" + enddate + "%27" 

// Crimes by location:
// Radius in meters:
var radius = 150;
// Lat and Long:
var latitude = 41.91673
var longitude = -87.631749

var locationqueryURL = "https://data.cityofchicago.org/resource/6zsd-86xi.json?$where=within_circle(location,%20" + latitude + ",%20" + longitude + ",%20" + radius + ")"
console.log(datequeryURL);

var results = {};

// AJAX Request:
$.ajax({
	url: locationqueryURL,
	method: "GET"
}).done(function(response) {
	// console.log(response);
	results = response;
	for (var i = 0; i < response.length; i++) {

		results[i] = {
			"Date": response[i].date,
			"Type": response[i].primary_type,
			"lat": response[i].latitude, 
			"lon": response[i].longitude
		}
		marker = new google.maps.Marker({
			position: new google.maps.LatLng(results[i].lat, results[i].lon),
			map: map
		});

		google.maps.event.addListener(marker, 'click', (function(marker, i) {
			return function() {
				infowindow.setContent(results[i].Type);
				infowindow.open(map, marker);
			}
		})(marker, i));
		// console.log(results[i]);
	};

	// console.log(results);
});

// Map part: ------------------------------------------------------------------------


var map = new google.maps.Map(document.getElementById('map'), {
	zoom: 11,
	center: new google.maps.LatLng(41.8781, -87.6298),
	mapTypeId: google.maps.MapTypeId.ROADMAP
});

var infowindow = new google.maps.InfoWindow();

var marker, i;

// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

function initAutocomplete() {
	var map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 41.8781, lng:-87.6298},
		zoom: 13,
		mapTypeId: 'roadmap'
	});

// Create the search box and link it to the UI element.
var input = document.getElementById('pac-input');
var searchBox = new google.maps.places.SearchBox(input);
map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

// Bias the SearchBox results towards current map's viewport.
map.addListener('bounds_changed', function() {
	searchBox.setBounds(map.getBounds());
});

var markers = [];

// Listen for the event fired when the user selects a prediction and retrieve
// more details for that place.
searchBox.addListener('places_changed', function() {
	var places = searchBox.getPlaces();

	if (places.length == 0) {
		return;
	}

// Clear out the old markers.
markers.forEach(function(marker) {
	marker.setMap(null);
});
markers = [];

// For each place, get the icon, name and location.
var bounds = new google.maps.LatLngBounds();
places.forEach(function(place) {
	if (!place.geometry) {
		console.log("Returned place contains no geometry");
		return;
	}
	var icon = {
		url: place.icon,
		size: new google.maps.Size(71, 71),
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(17, 34),
		scaledSize: new google.maps.Size(25, 25)
	};

// Create a marker for each place.
markers.push(new google.maps.Marker({
	map: map,
	icon: icon,
	title: place.name,
	position: place.geometry.location
}));

if (place.geometry.viewport) {
       // Only geocodes have viewport.
       bounds.union(place.geometry.viewport);

   } else {
   	bounds.extend(place.geometry.location);
   }
});
map.fitBounds(bounds);
});
}
