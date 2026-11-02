/* Garde l'appli sur le téléphone : elle s'ouvre sans réseau, et se met à jour en silence quand il y en a. */
const C = "ma-journee-fdca63ab26", FILES = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png"];
self.addEventListener("install", e => e.waitUntil(caches.open(C).then(c => c.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x)))).then(() => self.clients.claim())));
self.addEventListener("fetch", e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET") return;
  if (u.hostname === "api.github.com" || u.pathname.startsWith("/mock/")) return;
  if (r.mode === "navigate") {
    e.respondWith(fetch(r).then(x => { const y = x.clone(); caches.open(C).then(c => c.put("index.html", y)); return x; }).catch(() => caches.match("index.html")));
    return;
  }
  e.respondWith(caches.match(r).then(h => h || fetch(r).then(x => {
    if (u.origin === location.origin || /fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)) { const y = x.clone(); caches.open(C).then(c => c.put(r, y)); }
    return x;
  })));
});
