/* Adaptador de Treino — service worker
   As 120 fotos estao embutidas no index.html, entao o offline cobre o app inteiro
   (incluindo as imagens). So a adaptacao por IA (/api/adapt) precisa de rede.
*/
const VERSION = 'v2';
const SHELL = 'treino-shell-' + VERSION;
const ASSETS = ['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-512.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(SHELL).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.map(k => k !== SHELL ? caches.delete(k) : null))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', function (e) {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.pathname.indexOf('/api/') === 0) return; // IA sempre via rede
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.open(SHELL).then(cache => cache.match(req).then(hit => {
        const net = fetch(req).then(resp => { if (resp && resp.status === 200) cache.put(req, resp.clone()); return resp; }).catch(() => hit);
        return hit || net;
      }))
    );
  }
});
