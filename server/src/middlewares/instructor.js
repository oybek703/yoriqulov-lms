const asyncMiddleware = require('../utils/async')
const ErrorResponse = require('../utils/errorResponse')

exports.checkInstructor = asyncMiddleware(async (req, res, next) => {
    try {
        if(req.user.role.includes('Instructor')) next()
    } catch (e) {
        console.log(e)
        next(new ErrorResponse(500, 'Something went wrong on server side.'))
    }
})