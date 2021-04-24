const FILES_TO_CACHE = [
    '/index.html',
    '/index.js',
    '/db.js',
    '/styles.css',
    '/manifest.webmanifest',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
  ];
  
const CACHE_NAME = "static-cache-v1";
const DATA_CACHE_NAME = "data-cache-v1";

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});



// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("Deleting Old Cache", key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then((cachedResponse) => {
        return fetch(event.request)
          .then(nestResponse => {
            if (nestResponse.status === 200) {
              cachedResponse.put(event.request.url, nestResponse.clone());
            }
            return nestResponse;
        }).catch(err => {
          return cachedResponse.match(event.request);
        })
      }).catch(err => console.log(err))
    );
    return;
  }
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(response =>{
        return response || fetch(event.request)
      })
    })
  )
});
