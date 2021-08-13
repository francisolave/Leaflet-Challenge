var myMap = L.map("earthquakeMap", {
    center: [63.5887, 16.2902],
    zoom: 5 
});

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 500,
    maxZoom: 20,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);

var allLastSevenDaysURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(allLastSevenDaysURL).then(function(response) {

function markerSize(quakeSize) {
    return quakeSize*20000;
}

// depth 0km - 671.69km
function circleColor(quakeDepth) {
  var color = "";

    if (quakeDepth < 10)
         color = "rgb(58, 240, 64)"; 
    else if (quakeDepth < 20)
         color = "rgb(170, 240, 58)";
    else if (quakeDepth < 30)
         color = "rgb(240, 240, 58)";
    else if (quakeDepth < 50)
         color = "rgb(247, 185, 59)";
    else if (quakeDepth < 100)
         color = "rgb(247, 128, 59)";
    else if (quakeDepth >= 100)
         color = "rgb(247, 62, 59)";
    else
        color = "black";
  
  return color;  
}

for (var i = 0; i < response.features.length; i++) {
     L.circle(([response.features[i].geometry.coordinates[1], response.features[i].geometry.coordinates[0]]), {
          fillOpacity: 0.75,
          color: "black",
          weight: 0.5,
          fillColor: circleColor(Math.abs(response.features[i].geometry.coordinates[2])),
          radius: markerSize(Math.abs(response.features[i].properties.mag))

     }).bindPopup("<h3>Magnitude: " + response.features[i].properties.mag +
                 "</h3><h3>Depth: " + Math.abs(response.features[i].geometry.coordinates[2]) + "KM</h3><hr>" +
                 "<h3>Lat: " + response.features[i].geometry.coordinates[1] + ", Lng: " +
                 response.features[i].geometry.coordinates[0] + "</h3")
     .addTo(myMap);


}

// create legend in order to display the info on map
var info = L.control({
     position: "bottomright"
});

// layer control added, need to insert div with the class
info.onAdd = function() {
     var div = L.DomUtil.create("div", "legend");
     div.innerHTML = "<h4>Earthquake Depth (KM)</h4>" + [
          "<div class=\"box\" style=\"background-color: rgb(58, 240, 64)\">0 - 9.9</div>",
          "<div class=\"box\" style=\"background-color: rgb(170, 240, 58)\">10 - 19.9</div>",
          "<div class=\"box\" style=\"background-color: rgb(240, 240, 58 )\">20 - 29.9</div>",
          "<div class=\"box\" style=\"background-color: rgb(247, 185, 59)\">30 - 49.9</div>",
          "<div class=\"box\" style=\"background-color: rgb(247, 128, 59)\">50 - 99.9</div>",
          "<div class=\"box\" style=\"background-color: rgb(247, 62, 59)\">100 <=</div>",
     ].join("<br>");
     return div;
};
// add info legend to map 
info.addTo(myMap);

});





