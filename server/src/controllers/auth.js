const asyncMiddleware = require('../utils/async')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')

// @desc Register new user
// @route /auth/register
// access Public
exports.registerUser = asyncMiddleware(async (req, res) => {
    const {name, email, password} = req.body
    if (!name) throw new ErrorResponse(400, 'Name is required')
    if (
        !password ||
        password.length < 6 ||
        password.length > 20
    ) throw new ErrorResponse(400, 'Password is required')
    const user = await User.findOne({where: {email}})
    if(user) throw new ErrorResponse(400, 'User with this email already exists.')
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const newUser = await User.create({
        username: name, email, password: hashedPassword
    })
    res.status(201).json({success: true, user: newUser})
})