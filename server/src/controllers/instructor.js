const asyncMiddleware = require('../utils/async')
const ErrorResponse = require('../utils/errorResponse')
const stripe = require('stripe')(process.env.STRIPE_SECRET)
const queryString = require('query-string')
const {Course, Lesson} = require('../models/Course')
const sequelize = require('sequelize')

// @desc Make user instructor
// @route /makeInstructor
// access Private
exports.makeInstructor = asyncMiddleware(async (req, res) => {
    // 1. find user from database
    const user = req.user
    // 2. if user does not have stripe_account_id, then create new one
    if(!user.stripe_account_id) {
        const account = await stripe.accounts.create({type: 'express'})
        user.stripe_account_id = account.id
        await user.save()
    }
    // 3. create account link base on account id(for frontend to complete onboard)
    let accountLink = await stripe.accountLinks.create({
        account: user.stripe_account_id,
        refresh_url: process.env.STRIPE_REDIRECT_URL,
        return_url: process.env.STRIPE_REDIRECT_URL,
        type: 'account_onboarding'
    })
    // 4. pre-fill any info such as email(optional), then send url response to frontend
    accountLink = {...accountLink, ['stripe_user[email]']: user.email}
    // 5. then send account link as response to frontend
    const accountLinkFrontend = `${accountLink.url}?${queryString.stringify(accountLink)}`
    res.json({success: true, url: accountLinkFrontend})
})

// @desc Get user account status
// @route /getAccountStatus
// access Private
exports.getAccountStatus = asyncMiddleware(async (req, res) => {
    const user = req.user
    const account = await stripe.accounts.retrieve(user.stripe_account_id)
    if(!account.charges_enabled) throw new ErrorResponse(401, 'UnAuthorized')
    const updatedRole = Array.from(new Set(user.role).add('Instructor'))
    const stripeSeller = `${account.country.toLowerCase()}__${account.id}`
    await user.update({stripe_seller: stripeSeller, role: updatedRole})
    res.json({success: true, user: {...user, stripe_seller: account}})
})


// @desc Get instructor courses
// @route /myCourses
// access Private
exports.getInstructorCourses = asyncMiddleware(async (req, res) => {
    const courses = await Course.findAll({
        where: {userId: req.user.id},
        attributes: {include: [[sequelize.fn('count', sequelize.col('lessons.id')), 'lessons']]},
        include: [{model: Lesson, attributes: []}],
        group: ['Course.id']
    })
    res.json({success: true, courses})
})

// @desc Add lesson to course
// @route /lessons/add
// access Private
exports.addLessonToCourse = asyncMiddleware(async (req, res) => {
    const {title, content, file, courseId} = req.body
    const course = await Course.findOne({where: {id: courseId}})
    if(!course) throw new ErrorResponse(404, 'Course not found!')
    console.log(course)
    res.json({success: true, lesson: {}})
})