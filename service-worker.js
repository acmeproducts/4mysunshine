// service-worker.js
const CACHE_NAME = '4mysunshine-v1.2';
const CACHE_URLS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/192.png',
    '/512.png'
];

// Install service worker and cache all resources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(CACHE_URLS))
            .then(() => self.skipWaiting())
    );
});

// Clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Network first, falling back to cache
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request.url.replace(self.location.origin, ''))
            .catch(() => caches.match(event.request))
    );
});

// Handle updates
self.addEventListener('message', event => {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
});
