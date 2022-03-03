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
    await User.create({
        username: name, email, password: hashedPassword
    })
    res.status(201).json({success: true, message: 'Registration success.'})
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


// @desc Forgot password
// @route /forgotPassword
// access Public
exports.forgotPassword = asyncMiddleware(async (req, res) => {
    const {email} = req.body
    const user = await User.findOne({where: {email}})
    if (!user) throw new ErrorResponse(404, `User does not exist`)
    const shortCode = Math.random().toString(36).slice(-6).toUpperCase()
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
    await transporter.sendMail({
        from: `Yoriqulov LMS ${process.env.EMAIL_USER}`,
        to: email,
        subject: 'Reset password',
        html: `<html lang="en">
                    <h1>Reset Password</h1>
                    <p>Use following code to reset your password:</p>
                    <h2 style="color: red">${shortCode}</h2>
                    <i>yoriqulov-lms</i>
               </html>`
    })
    await user.update({resetPasswordCode: shortCode})
    res.json({success: true, message: 'Reset password code sent.'})
})

// @desc Reset password
// @route /resetPassword
// access Public
exports.resetPassword = asyncMiddleware(async (req, res) => {
    const {email, code, newPassword} = req.body
    if(!newPassword) throw new ErrorResponse(400, 'Password is required.')
    const user = await User.findOne({where: {email}})
    if(!user) throw new ErrorResponse(404, 'User does not exist')
    if(user.resetPasswordCode.toLowerCase() !== code.toLowerCase()) {
        throw new ErrorResponse(400, 'Invalid code.')
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)
    await user.update({password: hashedPassword, resetPasswordCode: ''})
    res.json({success: true, message: 'Password reset success.'})
})