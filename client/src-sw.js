const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst, StaleWhileRevalidate } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST);
const maxAgeSeconds = 30 * 24 * 60 * 60;
const maxEntries = 60;

const pageMatchCallback = ({ request }) => request.mode === 'navigate';
const pageCache = new CacheFirst({
  cacheName: 'jate-page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
  ],
});
warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});
registerRoute(pageMatchCallback, pageCache);

const imgMatchCallback = ({ request }) => request.destination === 'image';
const imgCache = new CacheFirst({
  cacheName: 'jate-image-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxEntries,
      maxAgeSeconds,
    }),
  ],
});
registerRoute(imgMatchCallback, imgCache);


const assestMatchCallback = ({ request }) => ['style', 'script', 'worker'].includes(request.destination);
const assetCache = new StaleWhileRevalidate({
  cacheName: 'jate-asset-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxEntries,
      maxAgeSeconds,
    }),
  ],
});
registerRoute(assestMatchCallback, assetCache);