
const bigSightZones = [
  { name: "West Hall 1F", coords: [35.631733, 139.795372], floor: 1 },
  { name: "West Hall 2F", coords: [35.631880, 139.795500], floor: 2 },
  { name: "South Hall 2F", coords: [35.632450, 139.796400], floor: 2 },
  { name: "East Hall 1F", coords: [35.632960, 139.799050], floor: 1 },
  { name: "East Hall 3F", coords: [35.633200, 139.799100], floor: 3 },
  { name: "Conference Tower", coords: [35.630930, 139.795930], floor: 7 }
];

// Adjacency: indicates that two areas are connected
// Each key is the name of bigSightZones, and the value is an array of adjacent zones
const adjacencyList = {
  "West Hall 1F":    ["West Hall 2F"],
  "West Hall 2F":    ["West Hall 1F", "South Hall 2F", "Conference Tower"],
  "South Hall 2F":   ["West Hall 2F", "East Hall 1F"],
  "East Hall 1F":    ["South Hall 2F", "East Hall 3F"],
  "East Hall 3F":    ["East Hall 1F"],
  "Conference Tower":["West Hall 2F"]
};


//  Tokyo Big Sight
let map = L.map('map').setView([35.6320, 139.7960], 16); 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data © OpenStreetMap contributors'
}).addTo(map);

//storage
window.currentRoute = null;


//load
function loadBigSightZones() {
  const zoneList = document.getElementById("zoneList");
  zoneList.innerHTML = "";

  bigSightZones.forEach((zone, index) => {
    // 1. li
    let li = document.createElement("li");
    li.textContent = `${zone.name} (Floor: ${zone.floor})`;
    li.onclick = () => {
      // map move
      map.setView(zone.coords, 18);
      // Marker
      L.marker(zone.coords).addTo(map).bindPopup(zone.name).openPopup();
      // navToZone
    };
    zoneList.appendChild(li);

    // 2. marker
    L.marker(zone.coords).addTo(map).bindPopup(zone.name);
  });
}
loadBigSightZones();


//user location 
function findUser() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const userLocation = [position.coords.latitude, position.coords.longitude];
      map.setView(userLocation, 17);

      // Marker
      L.marker(userLocation).addTo(map).bindPopup("You are here").openPopup();
    }, () => {
      alert("cant access user location");
    });
  } else {
    alert("geolocation not supported");
  }
}


//nav
function navToZone(zoneIndex) {
  if (!navigator.geolocation) {
    alert("geolocation not supported");
    return;
  }


  let destZone = bigSightZones[zoneIndex];

  navigator.geolocation.getCurrentPosition(position => {
    let userCoords = [position.coords.latitude, position.coords.longitude];


    let nearestZoneIndex = findNearestZone(userCoords);
    let nearestZone = bigSightZones[nearestZoneIndex];

    // (nearestZone -> destZone)
    let path = calculateRoute(nearestZone.name, destZone.name);

    // clean
    if (window.currentRoute) map.removeLayer(window.currentRoute);

    // no path
    if (!path || path.length === 0) {
      document.getElementById("routeInstructions").textContent = "No path found";
      return;
    }

    // coords
    let latLngPath = path.map(zoneName => {
      let z = bigSightZones.find(x => x.name === zoneName);
      return z.coords;
    });

    // route
    window.currentRoute = L.polyline(latLngPath, { color: 'blue' }).addTo(map);
    map.fitBounds(window.currentRoute.getBounds());

    // show
    let instructions = "Route: " + path.join(" → ");
    document.getElementById("routeInstructions").textContent = instructions;

  }, () => {
    alert("geolocation cant found");
  });
}

//place user
function findNearestZone(userCoords) {
  let minDist = Infinity;
  let nearestIndex = 0;

  bigSightZones.forEach((zone, idx) => {
    let dist = distance(userCoords, zone.coords);
    if (dist < minDist) {
      minDist = dist;
      nearestIndex = idx;
    }
  });
  return nearestIndex;
}

//bfs
function calculateRoute(startName, endName) {
  // BFS
  let queue = [ [startName] ];
  let visited = new Set([startName]);

  while (queue.length > 0) {
    let path = queue.shift();
    let last = path[path.length - 1];

    // find
    if (last === endName) {
      return path;
    }

    // reelvant
    let neighbors = adjacencyList[last] || [];
    for (let neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        let newPath = [...path, neighbor];
        queue.push(newPath);
      }
    }
  }

  // no path
  return null;
}

//A-B
function distance(a, b) {
  let dx = a[0] - b[0];
  let dy = a[1] - b[1];
  return Math.sqrt(dx*dx + dy*dy);
}


//sound part
function startAdvancedVoiceGuidance() {
  let instructions = document.getElementById("routeInstructions").textContent;
  if (!instructions || instructions.includes("No path")) {
    alert("No valid route instructions found.");
    return;
  }
  let speech = new SpeechSynthesisUtterance();
  speech.text = instructions;
  speech.lang = "en-US"; 
  window.speechSynthesis.speak(speech);
}


//fake ai
function getRecommendation() {
  const recommendations = [
    "Visit West Hall for major exhibitions on ground floor",
    "Check out South Hall for 2nd floor trending events",
    "East Hall is known for large-scale anime conventions",
    "Conference Tower often hosts VIP talks and presentations"
  ];
  document.getElementById("aiRecommendation").textContent =
    recommendations[Math.floor(Math.random() * recommendations.length)];
}
