const app = require('./app')

const port = process.env.PORT || 5000

app.listen(port, (error, info) => {
  if (!error) {
    console.log(`listening on ${port}`)
  }
})
