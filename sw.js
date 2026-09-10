/* Parole — cache hors ligne.
   Après modification de index.html, changer le numéro de version
   ci-dessous (v1 -> v2) pour forcer la mise à jour sur l'iPad. */
const VERSION = 'parole-v1';
const FICHIERS = ['./', './index.html', './manifest.webmanifest', './icone.png'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FICHIERS).catch(() => {})));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(cles => Promise.all(
      cles.filter(c => c !== VERSION).map(c => caches.delete(c))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(rep => rep || fetch(e.request).then(net => {
      const copie = net.clone();
      caches.open(VERSION).then(c => c.put(e.request, copie));
      return net;
    }).catch(() => caches.match('./index.html')))
  );
});
