/* Service Worker — Compartimos
   - HTML / navegación: network-first (si hay red, siempre la última versión; cache solo offline).
   - Resto de assets: cache-first.

   ┌───────────────────────────────────────────────────────────────┐
   │  PARA PUBLICAR UNA ACTUALIZACIÓN A TODOS:                       │
   │  cambiá el número de VERSION de abajo (v6 -> v7 -> v8 ...)      │
   │  y subí este archivo + el index.html a GitHub.                 │
   │  A cada persona le va a aparecer el cartel "Hay versión nueva". │
   └───────────────────────────────────────────────────────────────┘ */

const VERSION = "v14";
const CACHE = "compartimos-" + VERSION;
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png"
];

self.addEventListener("install", e => {
  // NO llamamos skipWaiting acá a propósito: el SW nuevo queda "en espera"
  // hasta que la persona toque "Actualizar" en el cartel.
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// La app le manda este mensaje cuando la persona toca "Actualizar":
// activamos el SW nuevo de inmediato y la app se recarga sola.
self.addEventListener("message", e => {
  if (e.data && e.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== location.origin) return;   // el Worker/D1 nunca se cachea

  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then(r => r || caches.match("./index.html")))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(cached =>
      cached || fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      }).catch(() => cached)
    )
  );
});
