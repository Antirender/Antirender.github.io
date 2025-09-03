// a: event data
const events = [
  { name: "Comic Con 2025", location: "Toronto, Canada", coords: [43.6532, -79.3832] },
  { name: "Gaming Expo", location: "Los Angeles, USA", coords: [34.0522, -118.2437] },
  { name: "Anime Festival", location: "Tokyo, Japan", coords: [35.682839, 139.759455] },
  { name: "Tech Conference", location: "Shanghai, China", coords: [31.2304, 121.4737] }
];

// b: loadEvents() 
function loadEvents() {
  const eventList = document.getElementById("eventList");
  eventList.innerHTML = "";
  events.forEach((event, index) => {
      let li = document.createElement("li");
      li.textContent = `${event.name} - ${event.location}`;
      li.onclick = () => navToEvent(index); // nav
      eventList.appendChild(li);
  });
}
loadEvents();

// c: map set
var map = L.map('map').setView([20, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data © OpenStreetMap contributors'
}).addTo(map);

// d: find user location
function findUser() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
          const userLocation = [position.coords.latitude, position.coords.longitude];
          map.setView(userLocation, 10);
          L.marker(userLocation).addTo(map).bindPopup("you are here").openPopup();
      });
  } else {
      alert("geolocation not supported");
  }
}

// e: nav to event
function navToEvent(index) {
  let event = events[index];
  map.setView(event.coords, 10);
  L.marker(event.coords).addTo(map).bindPopup(event.name).openPopup();
  drawRoute(event.coords);
}

// f: route drawing
function drawRoute(destCoords) {
  if (!navigator.geolocation) {
      alert("geolocation not supported");
      return;
  }
  navigator.geolocation.getCurrentPosition(position => {
      let userCoords = [position.coords.latitude, position.coords.longitude];
      
      // clear previous route
      if (window.currentRoute) {
          map.removeLayer(window.currentRoute);
      }
      
      // new route
      window.currentRoute = L.polyline([userCoords, destCoords], { color: 'blue' }).addTo(map);
  });
}

// g: ai 
function getRecommendation() {
  const recommendations = [
      "anime lovers should check out anime festival in tokyo",
      "tech enthusiasts might enjoy tech conference in shanghai",
      "comic fans should visit comic con in toronto",
      "gamers would love gaming expo in los angeles"
  ];
  document.getElementById("aiRecommendation").textContent =
      recommendations[Math.floor(Math.random() * recommendations.length)];
}

// h: voice nav
function startVoiceGuidance() {
  let speech = new SpeechSynthesisUtterance();
  speech.text = "turn left at the main entrance, walk 200 meters to booth a12, then turn right";
  speech.lang = "en-US";
  window.speechSynthesis.speak(speech);
}
