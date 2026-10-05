/* Service Worker — Compartimos
   - HTML / navegación: network-first (si hay red, siempre la última versión; cache solo offline).
   - Resto de assets propios: cache-first.
   - Tipografía (Google Fonts): cache-first en un cache aparte, así la app se ve igual sin señal.
   - Las llamadas al Worker de datos NUNCA se cachean.

   ┌───────────────────────────────────────────────────────────────┐
   │  PARA PUBLICAR UNA ACTUALIZACIÓN A TODOS:                       │
   │  cambiá el número de VERSION de abajo (v22 -> v23 -> ...)       │
   │  y subí este archivo + el index.html a GitHub.                 │
   │  A cada persona le va a aparecer el cartel "Hay versión nueva". │
   └───────────────────────────────────────────────────────────────┘ */

const VERSION = "v22";
const CACHE = "compartimos-" + VERSION;
const FONTS = "compartimos-fonts";        // no lleva versión: las fuentes no cambian
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./logo.svg",
  "./favicon-32.png",
  "./apple-touch-icon.png",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png"
];

self.addEventListener("install", e => {
  // NO llamamos skipWaiting acá: el SW nuevo espera a que la persona toque "Actualizar".
  // Cada archivo se cachea por separado: si falta uno, la instalación NO se cae entera.
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(ASSETS.map(u => c.add(u).catch(() => {})))));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== FONTS).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", e => {
  if (e.data && e.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Tipografía de Google: cache-first en su propio cache
  if (url.origin === "https://fonts.googleapis.com" || url.origin === "https://fonts.gstatic.com") {
    e.respondWith(
      caches.open(FONTS).then(c => c.match(req).then(hit => hit || fetch(req).then(res => {
        if (res.ok || res.type === "opaque") c.put(req, res.clone());
        return res;
      }).catch(() => hit)))
    );
    return;
  }

  if (url.origin !== location.origin) return;   // el Worker/D1 nunca se cachea

  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res; })
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
