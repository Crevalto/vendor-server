const express = require('express')
require('./db/mongoose')
const app = express() // express object called app
const vendorRouter = require('./routes/vendor-routes')
// using json
app.use(express.json())
app.use(vendorRouter)

module.exports = app
