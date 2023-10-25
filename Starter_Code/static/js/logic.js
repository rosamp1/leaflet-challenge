// Creating the map object
let myMap = L.map("map", {
    center: [40.7128, -74.0059],
    zoom: 5
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Use this link to get the GeoJSON data.
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Define a function to determine marker size based on earthquake magnitude
function getMarkerSize(magnitude) {
    return magnitude * 5;
}

// Define a function to determine marker color based on earthquake depth
function getMarkerColor(depth) {
    if (depth < 10) {
        return 'green';
    } else if (depth < 30) {
        return 'yellow';
    } else if (depth < 50) {
        return 'orange';
    } else {
        return 'red';
    }
}

// Define a function to create popups for earthquake markers
function createPopup(feature) {
    return `<h3>${feature.properties.place}</h3><hr>Magnitude: ${feature.properties.mag}<br>Depth: ${feature.geometry.coordinates[2]} km`;
}

// Getting our GeoJSON data
d3.json(link).then(function (response) {
    if (response && response.features) {
        let features = response.features;
        console.log(features);

        let marker_limit = features.length;

        for (let i = 0; i < marker_limit && i < features.length; i++) {
            let feature = features[i];
            if (feature.geometry) {
                let location = feature.geometry.coordinates;
                let magnitude = feature.properties.mag;
                let depth = location[2];
                let markerSize = getMarkerSize(magnitude);
                let markerColor = getMarkerColor(depth);

                // Adding custom markers with popups
                L.circleMarker([location[1], location[0]], {
                    radius: markerSize,
                    color: 'black',
                    weight: 1,
                    fillColor: markerColor,
                    fillOpacity: 0.8
                })
                .bindPopup(createPopup(feature))
                .addTo(myMap);
            }
        }

        // Create a legend
        let legend = L.control({ position: "bottomright" });
        legend.onAdd = function (myMap) {
            let div = L.DomUtil.create("div", "info legend");
            let depths = [0, 10, 30, 50];
            let colors = ['green', 'yellow', 'orange', 'red'];

            div.innerHTML = '<h4>Earthquake Depth (km)</h4>';
            for (let i = 0; i < depths.length; i++) {
                div.innerHTML += `<i style="background: ${colors[i]}"></i>${depths[i] + (i === depths.length - 1 ? '+' : '')}<br>`;
            }

            return div;
        };
        legend.addTo(myMap);
    }
});


