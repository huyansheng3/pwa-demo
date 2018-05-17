/**
 * @file service-worker.js with workbox api
 * @desc [example](https://workbox-samples.glitch.me/examples/workbox-sw/)
 * @author liuruoran(liuruoran@baidu.com)
 */

/**
 * Import workbox-sw with `importScripts` function.
 * 1. Need adding publicPath manually.
 * 2. If the version of workbox updated, modification is also required.
 */
importScripts('/static/js/workbox-sw.prod.v2.1.2.js')

const workboxSW = new WorkboxSW({
  cacheId: 'lavas-cache',
  ignoreUrlParametersMatching: [/^utm_/],
  skipWaiting: true,
  clientsClaim: true,
})

// Define precache injection point.
workboxSW.precache([
  {
    url: '/index.html',
    revision: '64fd1eb9d30cfa74361b4bb145729b16',
  },
  {
    url: '/static/baidu_verify_DfUiPOz54E.html',
    revision: 'feade7d6e8cbc6b4f3013e51050b2e66',
  },
  {
    url: '/static/baidu_verify_GYDloIFRSj.html',
    revision: 'ef3be26fd0b6cc8a99f0f3177b23b3d6',
  },
  {
    url: '/static/css/index.68156a82.css',
  },
  {
    url: '/static/fonts/fontawesome-webfont.706450d7.ttf',
  },
  {
    url: '/static/fonts/fontawesome-webfont.d9ee23d5.woff',
  },
  {
    url: '/static/fonts/fontawesome-webfont.f7c2b4b7.eot',
  },
  {
    url: '/static/fonts/MaterialIcons-Regular.012cf6a1.woff',
  },
  {
    url: '/static/fonts/MaterialIcons-Regular.a37b0c01.ttf',
  },
  {
    url: '/static/img/fontawesome-webfont.29800836.svg',
  },
  {
    url: '/static/js/0.10d685ef.js',
  },
  {
    url: '/static/js/1.ea47e7d1.js',
  },
  {
    url: '/static/js/2.9a7de2b1.js',
  },
  {
    url: '/static/js/3.d72876a5.js',
  },
  {
    url: '/static/js/broadcast-channel-polyfill.js',
    revision: '7baf1710e3b90ebc237329386d4d56be',
  },
  {
    url: '/static/js/index.23f258a0.js',
  },
  {
    url: '/static/js/manifest.2266f97d.js',
  },
  {
    url: '/static/js/vendor.e03dcaa4.js',
  },
  {
    url: '/static/js/vue.0bac564a.js',
  },
  {
    url: '/static/js/workbox-sw.prod.v2.1.2.js',
    revision: '685d1ceb6b9a9f94aacf71d6aeef8b51',
  },
  {
    url: '/static/shell.html',
    revision: 'd0ec7cd90b3970effa3c8ba0e9c98d42',
  },
  {
    url: '/static/sw.html',
    revision: '31cf52ccd3918f6856316b7ff71b8d6a',
  },
  {
    url: '/appshell',
    revision: '5db746917f92a02cdd697088bbb6ed50',
  },
])

workboxSW.router.registerRoute(/\/.*/, workboxSW.strategies.networkFirst())

// Define response for HTML request.
workboxSW.router.registerNavigationRoute('/appshell', {
  whitelist: [
    /^\/app($|\/|\?)/,
    /^\/appshell($|\/|\?)/,
    /^\/codelab($|\/|\?)/,
    /^\/demo($|\/|\?)/,
    /^\/guide($|\/|\?)/,
    /^\/?($|\?)/,
    // /^($|\/|\?)/,
    /^\/pwa($|\/|\?)/,
    /^\/doc($|\/|\?)/,
    /^\/ready($|\/|\?)/,
    /^\/search($|\/|\?)/,
    /^\/error($|\/|\?)/,
  ],
})

workboxSW.router.registerRoute(
  /hm\.baidu\.com/,
  workboxSW.strategies.networkOnly()
)

workboxSW.router.registerRoute(
  /^http(s)*:\/\/[^/]+?\/baidu_verify_/,
  workboxSW.strategies.networkOnly()
)

workboxSW.router.registerRoute(
  /^http(s)*:\/\/[^/]+?\/mip/,
  workboxSW.strategies.networkFirst({
    networkTimeoutSeconds: 3,
  })
)

workboxSW.router.registerRoute(
  /\/sw-register\.js/,
  workboxSW.strategies.networkOnly()
)
