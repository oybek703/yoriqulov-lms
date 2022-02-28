const asyncMiddleware = require('../utils/async')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const jwt = require('jsonwebtoken')

// @desc Register new user
// @route /register
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
    if (user) throw new ErrorResponse(400, 'User with this email already exists.')
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const newUser = await User.create({
        username: name, email, password: hashedPassword
    })
    res.status(201).json({success: true, user: newUser})
})

// @desc Login user
// @route /login
// access Public
exports.loginUser = asyncMiddleware(async (req, res) => {
    const {email, password} = req.body
    const user = await User.findOne({where: {email}})
    if (!user) throw new ErrorResponse(404, 'Invalid credentials user does not exist.')
    const isValidPassword = await bcrypt.compare(password, user.password)
    if(!isValidPassword) throw new ErrorResponse(400, 'Invalid credentials.')
    const token = jwt.sign(
        {id: user.id},
        process.env.JWT_SECRET,
        {expiresIn: '7d'}
        )
    user.password = undefined
    res.cookie('token', token, {
        httpOnly: true,
        // secure: true /* when used with https */
    }).json({success: true, user})
})