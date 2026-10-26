// Offline-Cache. Bei jeder Änderung an den Dateien VERSION erhöhen.
const VERSION = 'vorratsplaner-v21';
const FILES = ['./', 'index.html', 'app.js', 'datenschutz.html', 'versionen.html', 'manifest.webmanifest',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png'];
const NET_TIMEOUT = 3000; // bei schlechtem Netz nach 3 s auf die gespeicherte Version zurückgreifen

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Erst Netz (für Updates), bei Ausfall oder nach 3 s aus dem Cache. Nur eigene Dateien, nur gültige Antworten speichern.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  const fromCache = () => caches.match(req, { ignoreSearch: true })
    .then(r => r || (req.mode === 'navigate' ? caches.match('index.html') : undefined));
  const fromNet = fetch(req).then(r => {
    if (r.ok && r.type === 'basic') { const copy = r.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
    return r;
  });
  e.respondWith(new Promise(resolve => {
    let done = false;
    const finish = r => { if (!done && r) { done = true; resolve(r); } };
    const timer = setTimeout(() => fromCache().then(finish), NET_TIMEOUT);
    fromNet.then(r => { clearTimeout(timer); finish(r); })
      .catch(() => { clearTimeout(timer); fromCache().then(r => r ? finish(r) : finish(Response.error())); });
  }));
});
