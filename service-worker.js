const CACHE_NAME = '2048-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './logo.jpg',
  './logo-192x192.png',
  './manifest.json'
];

// Встановлення Service Worker і кешування файлів
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Обробка запитів — беремо з кешу, якщо офлайн
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Оновлення кешу, якщо змінилась версія
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
