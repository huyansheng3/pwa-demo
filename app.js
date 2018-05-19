const express = require('express')
const debug = require('debug')('app:server')
const path = require('path')
const webpush = require('web-push')
const webpack = require('webpack')
const parse = require('body-parser')
const compress = require('compression')

const app = express()

const vapidKeys = {
  publicKey:
    'BMlWwbt-bVsiXBCh6pMB_LTrFSwcFEybrHCKuiXnhIaVRy-GPMJ9WT1DwRIQvTd560rqOb0GqRrUbuv4MQ0P-aQ',
  privateKey: 'XsqOyB3LRGrTpu26qr7DtXX54Xesycmmof4hwHXvGow',
}

webpush.setVapidDetails(
  'mailto:1211904437@qq.com',
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

app.use(express.static('./build'))

module.exports = app
