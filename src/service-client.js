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
  var key = urlBase64ToUint8Array(
    'BPLISiRYgXzzLY_-mKahMBdYPeRZU-8bFVzgJMcDuthMxD08v0cEfc9krx6pG5VGOC31oX_QEuOSgU5CYLqpzf0'
  )
  navigator.serviceWorker.ready.then(reg => {
    reg.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: key,
      })
      .then(subscription => {
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

export function swInit() {
  Notification.requestPermission()
  var SW = navigator.serviceWorker
  SW.register('sw.js')
    .then(function(registration) {})
    .catch(function(err) {})
  if (SW.controller) {
    console.log('send message ::')
    SW.controller.postMessage(location.href)
  }
  // 进行 web-push 订阅
  navigator.serviceWorker.ready.then(reg => {
    reg.pushManager.getSubscription().then(sub => {
      if (sub) return
      subscribe()
    })
  })
}
