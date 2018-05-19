importScripts('./path-to-regexp.js')

const isDev = true

const CACHE_VERSION = 3

const CURRENT_CACHES = {
  prefetch: 'prefetch-cache-v' + CACHE_VERSION,
}

const FILE_LISTS = ['js', 'css', 'png', 'svg']
const PATH_FILE = '/:file?' // 缓存接受的路径文件

var goSaving = function(url) {
  for (var file of FILE_LISTS) {
    if (url.endsWith(file)) return true
  }
  return false
}

// 判断 path/method/contentType

function checkFile(request) {
  var matchPath = pathtoRegexp(PATH_FILE)
  var url = location.pathname
  var method = request.method.toLowerCase()
  url = matchPath.exec(url)[1]
  return !!(goSaving(url) && method === 'get')
}

self.addEventListener('install', function(event) {
  var now = Date.now()
  var urlsToPrefetch = ['vendor.js']

  if (isDev) {
    // 开发环境跳过等待，直接激活当前 sw，保证是最新的 sw，便于调试开发
    event.waitUntil(self.skipWaiting())
  }

  event.waitUntil(
    caches
      .open(CURRENT_CACHES.prefetch)
      .then(function(cache) {
        var cachePromises = urlsToPrefetch.map(function(urlToPrefetch) {
          var url = new URL(urlToPrefetch, location.href)

          console.log('now send the request to' + url)

          var request = new Request(url)
          return fetch(request)
            .then(function(response) {
              if (response.status >= 400) {
                throw new Error(
                  'request for ' +
                    urlToPrefetch +
                    ' failed with status ' +
                    response.statusText
                )
              }

              return cache.put(urlToPrefetch, response)
            })
            .catch(function(error) {
              console.error('Not caching ' + urlToPrefetch + ' due to ' + error)
            })
        })

        return Promise.all(cachePromises).then(function() {
          console.log('Pre-fetching complete.')
        })
      })
      .catch(function(error) {
        console.error('Pre-fetching failed:', error)
      })
  )
})

self.addEventListener('activate', event => {
  // delete any caches that aren't in expectedCaches
  // which will get rid of static-v1
  event.waitUntil(
    caches
      .keys()
      .then(keys => {
        console.log('keys: ', keys)
        return Promise.all(
          keys.map(key => {
            if (CURRENT_CACHES.prefetch !== key) {
              // 当前缓存不一致的全部给清了
              console.log('old sw.js will be updated。...')
              return caches.delete(key)
            }
          })
        )
      })
      .then(() => {
        console.log('V2 now ready to handle fetches!')
      })
  )
})

self.addEventListener('fetch', function(event) {
  console.log('on fetch', event.request)
  // 检查是否需要缓存
  if (!checkFile(event.request)) return

  event.respondWith(
    caches.match(event.request).then(function(resp) {
      if (resp) {
        // 优先项目文件没有 hash 控制，所以每次读缓存，同时异步更新缓存，如果有 hash 控制，则没有必要如此浪费流量
        fetch(event.request)
          .then(function(response) {
            console.log('event.request:' + event)
            return caches.open(CURRENT_CACHES.prefetch).then(function(cache) {
              return cache.put(event.request, response.clone())
            })
          })
          .catch(error => {
            console.log('event.request error:' + error)
          })
        return resp
      }

      return fetch(event.request).then(function(response) {
        console.log('save file:' + location.href)
        // 需要缓存,则将资源放到 caches Object 中
        return caches.open(CURRENT_CACHES.prefetch).then(function(cache) {
          cache.put(event.request, response.clone())
          return response
        })
      })
    })
  )
})

self.addEventListener('message', event => {
  // test send note
  sendNote()

  console.log('receive message' + event.data)
  // 更新根目录下的 html 文件。
  var url = event.data
  console.log('update root file ' + url)
  event.waitUntil(
    caches.open(CURRENT_CACHES.prefetch).then(cache => {
      return fetch(url).then(res => {
        cache.put(url, res)
      })
    })
  )
})

self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.')
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`)

  const data = event.data.json() || {}
  const title = data.title || '推送标题'
  const options = {
    body: 'Yay it works.',
    icon: 'images/icon.png',
    badge: 'images/badge.png',
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', function(event) {
  var messageId = event.notification.data
  event.notification.close()
  if (event.action === 'focus') {
    focusOpen()
  }
})

function sendNote() {
  console.log('send Note')
  var title = '收到了一个 message'
  var body = 'We have received a push message.'
  var icon = '/student.png'
  var tag = 'simple-push-demo-notification-tag' + Math.random()
  var data = {
    doge: {
      wow: 'such amaze notification data',
    },
  }
  self.registration.showNotification(title, {
    body: body,
    icon: icon,
    tag: tag,
    data: data,
    actions: [
      {
        action: 'focus',
        title: 'focus',
      },
    ],
  })
}

function focusOpen() {
  var url = location.href
  clients
    .matchAll({
      type: 'window',
      includeUncontrolled: true,
    })
    .then(clients => {
      for (var client of clients) {
        if ((client.url = url)) return client.focus() // 只在手机端有效,PC 上无效
      }
      console.log('not focus')
      clients.openWindow(location.origin)
    })
}
