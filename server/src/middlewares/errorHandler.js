const ErrorResponse = require('../utils/errorResponse')

module.exports = function (err, req, res, next) {
    console.error(err)
    let message = err.message, statusCode = err.status === 200 ? 500 : err.status
    const error = new ErrorResponse(statusCode || 500, message || 'Something went wrong on the server side.')
    res.status(error.status).json({success: false, message: error.message})
}