function getColor(grade) {
  return grade > 5 ? '#F02A81' :
         grade > 4  ? '#F02AD2' :
         grade > 3  ? '#BA2AF0' :
         grade > 2  ? '#F0E12A' :
         grade > 1   ? '#F09C2A' :
         grade > 0   ? '#F06F2A' :
                    '#F06F2A';
}

var ksmap = L.map("mapid", {
//  center: [10, -40],
  center: [38.8, -116.4],
  zoom: 4
});

// Adding a tile layer (the background map image) to our map
// We use the addTo method to add objects to our map
// layer is the skin
// attribution is sourcing
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
  accessToken: API_KEY
}).addTo(ksmap);


// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
// Perform a GET request to the query URL
d3.json(queryUrl, function (data) {
  // Once we get a response, send the data.features object to the createFeatures function
  // createFeatures(data.features);
  console.log(data);

  data.features.forEach(obj => {
    var lat = obj.geometry.coordinates[1];
    var lng = obj.geometry.coordinates[0];
    var mag = obj.properties.mag;
    var place = obj.properties.place;

    L.circle([lat, lng], {
      stroke: false,
      fillOpacity: .75,
      color: getColor(mag),
      fillColor: getColor(mag),
      radius: mag * 60000
    }).bindPopup("<h2>" + place + "<h2><h2>Magnitude: " + mag + "</h2>").addTo(ksmap);
  });
});


var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(ksmap);

