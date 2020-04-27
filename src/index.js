const app = require('./app')
const port = process.env.PORT
//Server listen port
app.listen(port, () => console.log('Server is on port ' + port))
