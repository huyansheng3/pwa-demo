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

app.use(express.static('./build'))

module.exports = app
