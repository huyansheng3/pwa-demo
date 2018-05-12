import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'

ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker()

window.addEventListener('beforeinstallprompt', function(e) {
  // beforeinstallprompt event fired

  e.userChoice.then(function(choiceResult) {
    if (choiceResult.outcome === 'dismissed') {
      console.log('用户取消安装应用')
    } else {
      console.log('用户安装了应用')
    }
  })
})

// if (SW.controller) {
//   // 这是当前页面的 `controller`
//   console.log('send message ::')
//   SW.controller.postMessage('fetch document')
// }
