/**
 * GrowTrack — Service Worker
 * Caching strategy: Cache-first for static, Network-first for API
 */

const CACHE_NAME = 'growtrack-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/css/index.css',
  '/js/utils/helpers.js',
  '/js/utils/toast.js',
  '/js/api.js',
  '/js/auth.js',
  '/js/app.js',
  '/js/dashboard.js',
  '/js/habits.js',
  '/js/goals.js',
  '/js/mood.js',
  '/js/reports.js',
  '/js/settings.js',
  '/js/upgrade.js',
  '/js/admin/adminDashboard.js',
  '/js/admin/userManagement.js',
  '/js/admin/systemMetrics.js',
  '/js/knowledge.js',
  '/assets/Plain Sky Blue Background Hd.jpg',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png',
  '/manifest.json',
];

// Install — cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch — strategy based on request type
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API requests: Network-first with offline fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone and cache successful GET responses
          if (request.method === 'GET' && response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Try cache for GET requests
          if (request.method === 'GET') {
            return caches.match(request);
          }
          // For POST/PUT/DELETE when offline, return error
          return new Response(
            JSON.stringify({ success: false, message: 'You are offline. Data will sync when reconnected.', offline: true }),
            { headers: { 'Content-Type': 'application/json' }, status: 503 }
          );
        })
    );
    return;
  }

  // Static assets: Cache-first
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request)
        .then((response) => {
          // Cache new static assets
          if (response.ok && request.method === 'GET') {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to offline page for navigation requests
          if (request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
        });
    })
  );
});

// Background sync (for offline data queue)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-queue') {
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'SYNC_TRIGGERED' });
        });
      })
    );
  }
});
