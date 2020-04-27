const express = require('express')
require('./db/mongoose')

const app = express()
// using json
app.use(express.json())
module.exports = app
