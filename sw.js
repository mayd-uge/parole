/* Parole — cache hors ligne et mise à jour.
   VERSION doit reprendre le numéro APP_VERSION de index.html.

   Stratégie :
   - index.html : réseau d'abord (toujours à jour quand une connexion existe),
     cache en secours (fonctionne hors ligne).
   - autres fichiers : cache d'abord, réseau en secours.
   Combinée au rechargement automatique côté page, toute publication
   est appliquée sur l'iPad dès la prochaine ouverture connectée. */
const VERSION = 'parole-1.2.0';
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
  const url = new URL(e.request.url);
  const estPage = e.request.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('index.html');

  if (estPage) {
    e.respondWith(
      fetch(e.request).then(net => {
        const copie = net.clone();
        caches.open(VERSION).then(c => c.put(e.request, copie));
        return net;
      }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(rep => rep || fetch(e.request).then(net => {
      const copie = net.clone();
      caches.open(VERSION).then(c => c.put(e.request, copie));
      return net;
    }))
  );
});
