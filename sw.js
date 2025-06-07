const CACHE_NAME = 'noneup-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/logo.jpg', // Якщо використовуєте його для іконок
  '/logo.jpg', // Якщо створили
  '/logo.jpg', // Якщо створили
  'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap'
  // Додайте всі інші ресурси, які сайт потребує для офлайн роботи
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Відкрито кеш');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Якщо ресурс є в кеші, повертаємо його
        }
        return fetch(event.request); // Інакше, завантажуємо з мережі
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // Видаляємо старі кеші
          }
        })
      );
    })
  );
});