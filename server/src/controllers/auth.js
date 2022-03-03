const asyncMiddleware = require('../utils/async')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const jwt = require('jsonwebtoken')
const nodeMailer = require('nodemailer')

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
    if (!isValidPassword) throw new ErrorResponse(400, 'Invalid credentials.')
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

// @desc Logout user
// @route /logout
// access Private
exports.logoutUser = asyncMiddleware(async (req, res) => {
    res.clearCookie('token').json({success: true, message: 'Logout success.'})
})

// @desc Get current user
// @route /currentUser
// access Private
exports.getCurrentUser = asyncMiddleware(async (req, res) => {
    res.json({success: true, user: req.user})
})


// @desc Send email
// @route /sendEmail
// access Private
exports.sendEmail = asyncMiddleware(async (req, res) => {
    const transporter = nodeMailer.createTransport({
        host: process.env.EMAIL_HOST,
        service: process.env.EMAIL_SERVICE,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_USER_PASSWORD
        }
    })
    const data = await transporter.sendMail({
        from : `Yoriqulov LMS ${process.env.EMAIL_USER}`,
        to: 'hhoybek@gmail.com',
        subject: 'Reset password',
        text: `Please use this link to reset your password`,
        html: `<html lang="en">
                    <a href="#">http://localhost?code=lkamcm938u8ycnr34*/c*2r*c/c3w4ru2h3h</a>
               </html>`
    })
    res.json({ok: true})
})