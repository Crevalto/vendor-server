const express = require('express')
require('./db/mongoose')
const app = express() // express object called app

// using json
app.use(express.json())
module.exports = app
