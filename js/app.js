var tileApiEndpoint =
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw";
var apiAttribution =
  'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

/** Check whether the user is on touchscreen device or not */
var isTouchScreenDevice = navigator.maxTouchPoints > 0;

/** Load all the tiles. */
var satelliteTile = L.tileLayer(tileApiEndpoint, {
  id: "mapbox/satellite-streets-v11",
  tileSize: 512,
  zoomOffset: -1,
  attribution: apiAttribution,
});
var streetTile = L.tileLayer(tileApiEndpoint, {
  id: "mapbox/streets-v11",
  tileSize: 512,
  zoomOffset: -1,
  attribution: apiAttribution,
});

/** Marker Icon for Earthquake Layer */
var earthquakeIcon = L.icon({
  iconUrl: "assets/earthquake.png",
  iconSize: [20, 20],
});

/**  Map Container Element */
var mapContainer = L.map("map-container", {
  zoom: 5,
  center: [-1.62, 113.23],
  layers: [satelliteTile],
  zoomControl: false,
});

/** Load GeoJSON data. */
fetch("data/earthquake.geojson")
  .then((response) => response.json())
  .then((geojson) => {
    var earthquakeLayer = L.geoJSON(geojson, {
      onEachFeature: onEachFeature,
      pointToLayer: pointToLayer,
    }).addTo(mapContainer);

    addControlLayers({ Earthquake: earthquakeLayer });
  });

/**
 * Add layer selector.
 */
function addControlLayers(geojsonLayers) {
  L.control
    .layers({ Satellite: satelliteTile, Street: streetTile }, geojsonLayers, {
      position: "topleft",
    })
    .addTo(mapContainer);
}

/**
 * Add coordinate information for non-mobile device.
 */
if (!isTouchScreenDevice) {
  L.control
    .coordinates({
      position: "topright",
      decimals: 2,
      decimalSeparator: ",",
      labelTemplateLat: "Latitude: {y}",
      labelTemplateLng: "Longitude: {x}",
    })
    .addTo(mapContainer);
}

/**
 * Bind each feature with a popup and insert feature's properties on it.
 */
function onEachFeature(feature, leaflet) {
  if (!"properties" in feature) {
    return;
  }

  var popupInnerHtml = [];
  for (var key in feature.properties) {
    var value = feature.properties[key];
    var htmlValue = "";
    if (key.toLowerCase() === "reference" && value !== "") {
      htmlValue = `<a href="${value}">${value}</a>`;
    } else {
      htmlValue = value;
    }

    popupInnerHtml.push(`<strong>${key}</strong>: ${htmlValue}`);
  }
  leaflet.bindPopup(popupInnerHtml.join("<br />"));
}

/**
 * Map each point to use earthquake icon.
 */
function pointToLayer(_, latlon) {
  return L.marker(latlon, { icon: earthquakeIcon });
}

/**
 * Ask users to grant geolocation permission,
 *  then add a marker into our map.
 */
function promptDeviceGeolocation() {
  if (!window.isSecureContext) {
    return;
  }

  navigator.geolocation.getCurrentPosition(function (position) {
    var userMarker = L.marker([
      position.coords.latitude,
      position.coords.longitude,
    ]).addTo(mapContainer);
    userMarker.bindPopup("<strong>Your position!</strong>");
  });
}
document.onreadystatechange = function () {
  if (document.readyState === "complete") {
    promptDeviceGeolocation();
  }
};
