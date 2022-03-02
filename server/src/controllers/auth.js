const asyncMiddleware = require('../utils/async')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const jwt = require('jsonwebtoken')
const aws = require('aws-sdk')

const ses = new aws.SES({
    accessKeyId: process.env.AWS_ACCESS_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    apiVersion: process.env.AWS_API_VERSION
})

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
    const sentEmail = await ses.sendEmail({
        Source: process.env.EMAIL_FROM,
        Destination: {
            ToAddresses: ['hohoybek@gmail.com']
        },
        ReplyToAddresses: [process.env.EMAIL_FROM],
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: `
                        <html lang="en">
                            <h1>Reset password link</h1>
                            <p>Please use following list to reset your password.</p>
                        </html>    
                    `
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'Password reset link'
            }
        }
    }).promise()
    console.log(sentEmail)
    res.json({ok: true})
})