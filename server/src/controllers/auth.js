const asyncMiddleware = require('../utils/async')

// @desc Register new user
// @route /auth/register
// access Public
exports.registerUser = asyncMiddleware(async (req, res) => {
    res.send('register user')
})