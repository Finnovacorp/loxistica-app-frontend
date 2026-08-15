// Loxistica Service Worker — v2.1
// Caches the app shell so it loads instantly and the install prompt appears.
// API calls are always network-first (no offline API caching — live ERP data only).

const CACHE_NAME   = 'loxistica-shell-v2.1';
const OFFLINE_URL  = '/offline.html';

const SHELL_ASSETS = [
    '/',
    '/index.html',
    '/offline.html',
    '/manifest.json',
    '/logo.png',
    '/favicon.png',
    '/favicon.ico',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    '/icons/apple-touch-icon.png',
];

// ─── Install: cache shell assets ──────────────────────────────────────────────
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(SHELL_ASSETS))
            .then(() => self.skipWaiting())
    );
});

// ─── Activate: delete old caches ─────────────────────────────────────────────
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys
                    .filter(k => k !== CACHE_NAME)
                    .map(k  => caches.delete(k))
            ))
            .then(() => self.clients.claim())
    );
});

// ─── Fetch: network-first for API, cache-first for shell ─────────────────────
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Always go network-first for ERP API calls
    if (url.hostname !== self.location.hostname) {
        event.respondWith(
            fetch(request).catch(() =>
                new Response(JSON.stringify({ error: 'No internet connection.' }), {
                    headers: { 'Content-Type': 'application/json' },
                })
            )
        );
        return;
    }

    // Navigation requests: serve from cache, fall back to index.html (SPA),
    // then offline page if everything fails.
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .catch(() =>
                    caches.match('/index.html').then(r => r ?? caches.match(OFFLINE_URL))
                )
        );
        return;
    }

    // Static assets: cache-first
    event.respondWith(
        caches.match(request).then(cached => cached ?? fetch(request))
    );
});
