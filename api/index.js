const express = require('express')
const app = express()
const port = 3000

app.get('/users', (req, res) => {
  res.send('some users')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})