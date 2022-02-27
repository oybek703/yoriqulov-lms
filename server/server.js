require('colors')
const path = require('path')
const cors = require('cors')
require('dotenv').config({path: path.join(__dirname, './config/.env')})
const express = require('express')
const {checkConnection} = require('./config')
const errorHandler = require('./src/middlewares/errorHandler')
const notFoundPage = require('./src/middlewares/notFound')
const app = express()
const {readdirSync} = require('fs')

app.use(express.json())
app.use(cors())

//routes
readdirSync('./src/routes').map(route => {
    app.use(`/api`, require(`./src/routes/${route}`))
})

app.use(notFoundPage)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
checkConnection().then(() => {
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`.blue))
})


