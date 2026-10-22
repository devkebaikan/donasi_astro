const CACHE_NAME = 'beramalbersama-v1';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/assets/loading_splash/loading_splash.mp4',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/apple-touch-icon.png'
];

// Install: Cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('push', (event) => {
  if (!event.data) return;
  const payload = event.data.json();
  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      data: payload.data,
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const clickURL = event.notification.data?.url;
  let destination = '/';

  if (typeof clickURL === 'string' && clickURL) {
    try {
      const url = new URL(clickURL, self.location.origin);
      if (url.origin === self.location.origin) {
        destination = url.href;
      }
    } catch {
      // Fall back to the home page when a notification URL is malformed.
    }
  }

  event.waitUntil(self.clients.openWindow(destination));
});

// Fetch: Network-first strategy with cache fallback
self.addEventListener('fetch', (event) => {
  // Only handle GET requests and skip browser extensions or non-http requests
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  // Skip API routes if any
  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Clone and cache successful responses for static assets
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          (url.pathname.startsWith('/icons/') ||
           url.pathname.startsWith('/assets/') ||
           url.pathname.startsWith('/images/'))
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // If offline or fetch fails, fallback to cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If the request was for a webpage, fallback to cached root
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
          return new Response('Network error', { status: 408, headers: { 'Content-Type': 'text/plain' } });
        });
      })
  );
});
