const CACHE_NAME = "weather-handover-B7.3.7";
const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/icon.svg",
  "/icon-192.svg",
  "/icon-512.svg",
  "/auth-bridge.js"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL).catch(() => null))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);

  if (url.pathname === "/" || url.pathname === "/index.html") {
    event.respondWith(
      fetch(event.request).then(async res => {
        let text = await res.text();

        // ⭐ 自動升級版本顯示
        text = text.replace(/7\.3\.6/g, "7.3.7");

        // ⭐ 自動注入登入系統
        if (!text.includes("auth-bridge.js")) {
          text = text.replace("</body>", `<script type=\"module\" src=\"/auth-bridge.js?v=7.3.7\"></script></body>`);
        }

        return new Response(text, {
          headers: { "Content-Type": "text/html" }
        });
      }).catch(() => caches.match(event.request))
    );
    return;
  }

  if (
    url.hostname.includes("firebase") ||
    url.hostname.includes("googleapis") ||
    url.pathname.includes("/api/")
  ) {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      const network = fetch(event.request).then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone)).catch(() => null);
        return response;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
