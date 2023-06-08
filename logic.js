// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
// Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
});



function createFeatures(earthquakeData) {
    
    function onEachFeature(feature,layer) {
    layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "</h3><hr><p>" + "Magnitude: " + (feature.properties.mag) + "</p>");
    }
    function markerSize (magnitude) {
    return magnitude * 5;
    }
    function markerColor (magnitude) {
    if (magnitude <=1) 
    return "rgb(218,236,166)";
    else if (magnitude <=2)
    return "rgb(236,234,156)"; 
    else if (magnitude <=3) 
    return "rgb(236,213,146)";
    else if (magnitude <=4)
    return "rgb(223,183,120)";
    else if (magnitude <=5)
    return "rgb(229,160,91)"; 
    }

    let earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer:  function(feature,latlng) {
            return L.circleMarker(latlng, {
                radius:  markerSize(feature.properties.mag),
                fillColor:  markerColor(feature.properties.mag),
                color:  "#000",
                weight:  0.3,
                opacity:  0.4,
                fillOpacity:  1
            });
        },   
                onEachFeature: onEachFeature
    });
createMap(earthquakes);
}



function createMap(earthquakes) {

// Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            })
          
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
            });
          
// Create a baseMaps object.
    let baseMaps = {
              "Street Map": street,
              "Topographic Map": topo
            };
          
// Create an overlay object to hold our overlay.
    let overlayMaps = {
        Earthquakes: earthquakes
            };
          
// Create our map, giving it the streetmap and earthquakes layers to display on load.
    let myMap = L.map("map", {
        center: [
                35.47, -97.52
              ],
              zoom: 5,
              layers: [street, earthquakes]
            });
          
// Create a layer control.
// Pass it our baseMaps and overlayMaps.
// Add the layer control to the map.
L.control.layers(baseMaps, overlayMaps, {
collapsed: false
}).addTo(myMap);      
}