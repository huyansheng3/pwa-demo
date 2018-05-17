const express = require('express')
const debug = require('debug')('app:server')
const path = require('path')
const webpush = require('web-push')
const webpack = require('webpack')
const parse = require('body-parser')
const webpackConfig = require('../config/webpack.config')
const project = require('../config/project.config')
const compress = require('compression')

const app = express()

const vapidKeys = {
  publicKey:
    'BPLISiRYgXzzLY_-mKahMBdYPeRZU-8bFVzgJMcDuthMxD08v0cEfc9krx6pG5VGOC31oX_QEuOSgU5CYLqpzf0',
  privateKey: 'mRBtp5ZrkLp5sMiRpl833OcYqLcgLO8lvN5vFRiRw8o',
}

webpush.setVapidDetails(
  'mailto:villainthr@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
)

// Apply gzip compression
app.use(compress())

app.use(parse.json())
app.route('/subscription').post((req, res, next) => {
  console.dir('receive subscribe : ' + req.body)
  console.log(JSON.stringify(req.body))
  webpush
    .sendNotification(req.body, 'ok')
    .then(info => {
      console.log('发送成功:' + info)
    })
    .catch(err => {
      console.log(err)
    })
  res.json({ status: 'ok' })
})
// ------------------------------------
// Apply Webpack HMR Middleware
// ------------------------------------
if (project.env === 'development') {
  const compiler = webpack(webpackConfig)

  debug('Enabling webpack dev and HMR middleware')
  app.use(
    require('webpack-dev-middleware')(compiler, {
      publicPath: webpackConfig.output.publicPath,
      contentBase: project.paths.client(),
      hot: false, // 是否开启自定义文件更新,使用 module.hot.accept() 来优化
      quiet: project.compiler_quiet,
      noInfo: project.compiler_quiet,
      lazy: false,
      stats: project.compiler_stats,
    })
  )
  app.use(
    require('webpack-hot-middleware')(compiler, {
      path: '/__webpack_hmr',
    })
  )

  // Serve static assets from ~/public since Webpack is unaware of
  // these files. This middleware doesn't need to be enabled outside
  // of development since this directory will be copied into ~/dist
  // when the application is compiled.
  app.use(express.static(project.paths.public()))

  // This rewrites all routes requests to the root /index.html file
  // (ignoring file requests). If you want to implement universal
  // rendering, you'll want to remove this middleware.
  app.use('*', function(req, res, next) {
    const filename = path.join(compiler.outputPath, 'index.html')
    compiler.outputFileSystem.readFile(filename, (err, result) => {
      if (err) {
        return next(err)
      }
      res.set('content-type', 'text/html')
      res.send(result)
      res.end()
    })
  })
} else {
  debug(
    'Server is being run outside of live development mode, meaning it will ' +
      'only serve the compiled application bundle in ~/dist. Generally you ' +
      'do not need an application server for this and can instead use a web ' +
      'server such as nginx to serve your static files. See the "deployment" ' +
      'section in the README for more information on deployment strategies.'
  )

  // Serving ~/dist by default. Ideally these files should be served by
  // the web server and not the app server, but this helps to demo the
  // server in production.
  app.use(express.static(project.paths.dist()))
}

module.exports = app
