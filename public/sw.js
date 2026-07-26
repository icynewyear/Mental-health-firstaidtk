const CACHE_NAME = "mh-toolkit-v1";
const PRECACHE_ASSETS = [
  "./",
  "index.html",
  "manifest.json",
  "icon.svg"
];

// Install event: Precache core skeleton files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log("[Service Worker] Pre-caching core app shell");
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event: Clean up old, stale caches from previous versions
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              console.log("[Service Worker] Deleting old cache:", cache);
              return caches.delete(cache);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event: Stale-While-Revalidate caching strategy
self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  // Skip dynamic or operational backend endpoints (e.g. POST requests or server APIs)
  if (event.request.method !== "GET" || requestUrl.pathname.includes("/api/")) {
    return;
  }

  const isSameOrigin = requestUrl.origin === self.location.origin;
  const isGoogleFonts = requestUrl.hostname.includes("fonts.googleapis.com") || requestUrl.hostname.includes("fonts.gstatic.com");

  if (isSameOrigin || isGoogleFonts) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                cache.put(event.request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch((err) => {
              console.warn("[Service Worker] Offline: failed fetching " + requestUrl.pathname + ", serving from cache.", err);
            });

          // Return cached asset immediately for ultra-fast load, fallback to network fetch
          return cachedResponse || fetchPromise;
        });
      })
    );
  }
});
