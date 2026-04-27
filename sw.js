const CACHE_NAME="handover-pwa-v1";
const urls=["/","/manifest.webmanifest","/icon-192.svg","/icon-512.svg","/icon.svg"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(urls)));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))))});
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return; e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));});