const jwt = require('jsonwebtoken')
const asyncMiddleware = require('../utils/async')
const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')

exports.checkAuth = asyncMiddleware(async (req, res, next) => {
    try {
        const token = req.cookies['token']
        const {id} = await jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findByPk(id, {attributes: {exclude: ['password']}})
        next()
    } catch (e) {
        console.log(e)
        const {name} = e
        if(['JsonWebTokenError', 'TokenExpiredError'].indexOf(name) >= 0) return next(new ErrorResponse(440, 'Session expired.'))
        next(new ErrorResponse(500, 'Something went wrong on server side.'))
    }

})