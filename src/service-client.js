function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

function subscribe() {
  const publicKey =
    'BMlWwbt-bVsiXBCh6pMB_LTrFSwcFEybrHCKuiXnhIaVRy-GPMJ9WT1DwRIQvTd560rqOb0GqRrUbuv4MQ0P-aQ'

  var key = urlBase64ToUint8Array(publicKey)
  navigator.serviceWorker.ready.then(reg => {
    reg.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: key,
      })
      .then(subscription => {
        console.log('User is subscribed:', subscription)
        return fetch('/subscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(subscription),
        })
      })
  })
}

function askPermission() {
  return new Promise(function(resolve, reject) {
    let permissionResult
    if ('Notification' in window) {
      permissionResult = Notification.requestPermission(function(result) {
        // 旧版本
        resolve(result)
      })
    }
    if (permissionResult) {
      // 新版本
      permissionResult.then(resolve, reject)
    }
  }).then(function(permissionResult) {
    if (permissionResult !== 'granted') {
      // 用户未授权
      alert('取消授权后重新打开需点击地址栏左侧重新打开')
      console.error('用户未授权')
    }
  })
}

export function swInit() {
  askPermission()

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      var SW = navigator.serviceWorker
      SW.register('sw.js', { scope: '/' })
        .then(function(registration) {
          registration.onupdatefound = function() {
            var installingWorker = registration.installing
            installingWorker.onstatechange = function() {
              switch (installingWorker.state) {
                case 'installed':
                  if (navigator.serviceWorker.controller) {
                    var event = document.createEvent('Event')
                    event.initEvent('sw.update', true, true)
                    window.dispatchEvent(event)
                  }
                  break
              }
            }
          }
          if (SW.controller) {
            console.log('send message ::')
            SW.controller.postMessage(window.location.href)
          }

          console.log('register success')
        })
        .catch(function(err) {
          console.log('register error', err)
        })

      // 进行 web-push 订阅
      navigator.serviceWorker.ready.then(reg => {
        reg.pushManager.getSubscription().then(sub => {
          let isSubscribed = !(sub === null)

          if (isSubscribed) {
            console.log('User IS subscribed. ', sub)
            console.log(JSON.stringify(sub))
          } else {
            console.log('User is NOT subscribed.')
          }

          // 已经订阅则无需重复订阅
          if (sub) return
          subscribe()
        })
      })
    })
  }

  window.addEventListener('beforeinstallprompt', function(e) {
    e.userChoice.then(function(choiceResult) {
      if (choiceResult.outcome === 'dismissed') {
        alert('应用添加桌面失败')
      } else {
        alert('应用添加桌面成功')
      }
    })
  })
}
