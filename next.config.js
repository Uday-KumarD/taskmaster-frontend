const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: { maxEntries: 200 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    {
      urlPattern: /\/socket\.io\//,
      handler: 'NetworkOnly',
      options: { cacheName: 'socket-io' },
    },
  ],
});

module.exports = withPWA({
  reactStrictMode: true,
});