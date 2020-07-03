var CACHE_STATIC_NAME = "static-v1.0.1";
var CACHE_DYNAMIC_NAME = "dynamic-v1.0.0";

self.addEventListener("install", (event) => {
  // Wait until passed function(s) execute
  event.waitUntil(
    // Open a new cache (subcache, basically)
    caches.open(CACHE_STATIC_NAME).then((cache) => {
      // Precache app shell
      // add() makes the request, and caches result
      // cache.add("/");
      // cache.add("/index.html");
      // cache.add("/src/js/app.js");
      // use addAll for multiple requests
      cache.addAll([
        "/",
        "/index.html",
        "/src/js/app.js",
        "/src/js/feed.js",
        "/src/js/promise.js",
        "/src/js/fetch.js",
        "/src/js/material.min.js",
        "/src/css/app.css",
        "/src/css/feed.css",
        "/src/images/main-image.jpg",
        "https://fonts.googleapis.com/css?family=Roboto:400,700",
        "https://fonts.googleapis.com/icon?family=Material+Icons",
        "https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css",
      ]);
    })
  );
});

self.addEventListener("activate", (event) => {
  // Ensure that the worker did activate
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Respond to the fetch request
  event.respondWith(
    // Check if request is cached
    caches.match(event.request).then((response) => {
      if (response) return response;

      // Cache the dynamic response
      return fetch(event.request).then((res) => {
        caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
          // put() stores a request-response pair to cache
          cache.put(event.request.url, res.clone());
          // We use res.clone() above as, by default, a response can be
          // consumer exactly once only
          return res;
        });
      });
    })
  );
});
