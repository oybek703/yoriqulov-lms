const asyncMiddleware = require('../utils/async')
const {Course} = require('../models/Course')
const slugify = require('slugify')
const ErrorResponse = require('../utils/errorResponse')

// @desc Create and save course
// @route /course/create
// access Private
exports.createCourse = asyncMiddleware(async (req, res) => {
    const existingCourseTitle = await Course.findOne({where: {slug: slugify(req.body.name)}})
    if(existingCourseTitle) throw new ErrorResponse(400, 'Title is taken.')
    const newCourse = await Course.create({
        slug: slugify(req.body.name),
        UserId: req.user.id,
        ...req.body
    })
    res.json({success: true, newCourse})
})