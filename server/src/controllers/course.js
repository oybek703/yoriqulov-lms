const asyncMiddleware = require('../utils/async')
const {Course} = require('../models/Course')
const slugify = require('slugify')
const ErrorResponse = require('../utils/errorResponse')
const {Lesson} = require('../models/Course')

// @desc Create and save course
// @route /course/create
// access Private
exports.createCourse = asyncMiddleware(async (req, res) => {
    const existingCourseTitle = await Course.findOne({where: {slug: slugify(req.body.name)}})
    if(existingCourseTitle) throw new ErrorResponse(400, 'Title is taken.')
    const newCourse = await Course.create({
        slug: slugify(req.body.name),
        userId: req.user.id,
        ...req.body
    })
    res.json({success: true, newCourse})
})

// @desc Get single course
// @route /course/[slug]
// access Private
exports.getSingleCourse = asyncMiddleware(async (req, res) => {
    const {slug} = req.params
    const course = await Course.findOne({
        where: {id: slug},
        include: [{model: Lesson, attributes: {}}]
    })
    res.json({success: true, course})
})