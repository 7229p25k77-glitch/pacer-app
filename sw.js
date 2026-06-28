// Pacer service worker — lets the app open and run with no connection.
//
// Strategy: network-first. When online we always fetch the latest version
// (so newly pushed updates show up right away) and refresh the cache. When
// offline we serve the cached copy, so the app still opens and runs.
//
// Note: offline only works AFTER the first online load, which is what
// installs and caches the app on the device.

const CACHE   = 'pacer-v1';
const APP_URL = 'runna-app.html';

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.add(APP_URL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then((resp) => {
        const copy = resp.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
        return resp;
      })
      .catch(() => caches.match(e.request).then((cached) => cached || caches.match(APP_URL)))
  );
});
