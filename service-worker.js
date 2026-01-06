const CACHE = "varun-retro-v1";

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(cache =>
      cache.addAll([
        "/varun.retro/",
        "/varun.retro/index.html",
        "/varun.retro/style.css",
        "/varun.retro/script.js"
      ])
    )
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
