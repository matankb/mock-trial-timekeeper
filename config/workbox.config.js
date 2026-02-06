module.exports = {
  globDirectory: 'dist',
  globPatterns: ['**/*.{json,html,js,hbc,png,jpg,ttf}'],
  globIgnores: ['sw.js', 'workbox-*.js'], // don't have node_modules in the ignore
  swDest: 'dist/sw.js',
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  maximumFileSizeToCacheInBytes: 1024 * 1024 * 10, // 10MB, to allow for app to be cached
};
