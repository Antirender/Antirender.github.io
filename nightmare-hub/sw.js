const CACHE_NAME = "ne-cache-v6";
const ASSETS = [
  "./",
  "./index.html",
  "./hub.html",
  "./story.html",
  "./map.html",
  "./lore.html",
  "./puzzle1.html",
  "./puzzle2.html",
  "./puzzle3.html",
  "./dead-end.html",
  "./password.html",
  "./physical.html",
  "./ar.html",
  "./vr.html",
  "./rabbit-hole.html",
  "./feedback.html",
  "./ending.html",
  "./nmec.html",
  "./css/main.css",
  "./js/config.js",
  "./js/main.js",
  "./manifest.webmanifest"
];

self.addEventListener("install", function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; }).map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function(e) {
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request).catch(function() {
        return caches.match("./hub.html").then(function(r) { return r || caches.match("./index.html"); });
      })
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(function(r) { return r || fetch(e.request); })
  );
});
