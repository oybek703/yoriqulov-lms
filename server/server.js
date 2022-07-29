require('colors')
const path = require('path')
const cors = require('cors')
require('dotenv').config({path: path.join(__dirname, './config/.env')})
const express = require('express')
const {checkConnection} = require('./config')
const errorHandler = require('./src/middlewares/errorHandler')
const notFoundPage = require('./src/middlewares/notFound')
const cookieParser = require('cookie-parser')
const csrf = require('csurf')
const {readdirSync} = require('fs')

const app = express()

const csrfProtection = csrf({cookie: true, httpOnly: true})

app.use(express.json({limit: '10mb'}))
app.use(cors({credentials: true, origin: true}))
app.use(cookieParser(process.env.COOKIE_SECRET))

// routes
readdirSync('./src/routes').map(route => {
    app.use(`/api`, require(`./src/routes/${route}`))
})

app.use(csrfProtection)

app.get('/api/csrfToken', ((req, res) => {
    res.json({csrfToken: req.csrfToken()})
}))

app.use(notFoundPage)
app.use(errorHandler)

const PORT = process.env.PORT || 5001
checkConnection().then(() => {
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`.blue))
})


