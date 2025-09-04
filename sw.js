// Mill Cove Mood - Service Worker
const CACHE_NAME = 'mill-cove-mood-v3';
const DATA_CACHE_NAME = 'mill-cove-mood-data-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.svg',
  './icon-512.svg',
  './millcovesunset.jpg'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - network-first strategy for data, cache-first for assets
self.addEventListener('fetch', (event) => {
  // Handle weather data with network-first strategy (fresh data priority)
  if (event.request.url.includes('weather-data.json')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.status === 200) {
            // Cache fresh data with timestamp
            const responseToCache = response.clone();
            caches.open(DATA_CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Network failed, try cached data as fallback
          console.log('Network failed, serving cached weather data');
          return caches.match(event.request);
        })
    );
    return;
  }

  // Use network-first for HTML files to avoid version conflicts
  if (event.request.url.includes('.html') || event.request.url === self.location.origin + '/') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Network failed, try cached version as fallback
          console.log('Network failed, serving cached HTML');
          return caches.match(event.request);
        })
    );
    return;
  }

  // Handle other assets with cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          return response;
        }

        // Fetch from network and cache for next time
        return fetch(event.request).then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME, DATA_CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  // Take control of all clients immediately
  return self.clients.claim();
});
