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
    'BPKOph-DinoK781b-tcoQIvaRq4CyO6FS0C_a3R3H3jhIHJHXCE40bIhoP8sJcjz--_YE_Zi--_RjvNfvIhsOXI',
  privateKey: 'gQnlA1RjjwX5GPCy61G0WR-pWn1zSvyh6eA4Sd50o98',
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
