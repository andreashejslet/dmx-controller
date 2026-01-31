// Service Worker for DMX Controller PWA
const CACHE_NAME = ‘dmx-controller-v1’;
const urlsToCache = [
‘/’,
‘/index.html’,
‘/app.js’,
‘/manifest.json’
];

// Install - cache files
self.addEventListener(‘install’, event => {
event.waitUntil(
caches.open(CACHE_NAME)
.then(cache => cache.addAll(urlsToCache))
);
});

// Fetch - serve from cache, fallback to network
self.addEventListener(‘fetch’, event => {
// Don’t cache ESP32 requests
if (event.request.url.includes(‘192.168’) || event.request.url.includes(’/dmx’)) {
return;
}

event.respondWith(
caches.match(event.request)
.then(response => response || fetch(event.request))
);
});

// Activate - clean old caches
self.addEventListener(‘activate’, event => {
event.waitUntil(
caches.keys().then(cacheNames => {
return Promise.all(
cacheNames.map(cacheName => {
if (cacheName !== CACHE_NAME) {
return caches.delete(cacheName);
}
})
);
})
);
});
