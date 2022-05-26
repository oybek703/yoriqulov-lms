const asyncMiddleware = require('../utils/async')
const {Course} = require('../models/Course')
const slugify = require('slugify')
const ErrorResponse = require('../utils/errorResponse')
const {sequelize} = require('../../config')
const {Lesson} = require('../models/Course')

// @desc Create and save course
// @route /course/create
// access Private
exports.createCourse = asyncMiddleware(async (req, res) => {
    const existingCourseTitle = await Course.findOne({where: {slug: slugify(req.body.name)}})
    if (existingCourseTitle) throw new ErrorResponse(400, 'Title is taken.')
    const newCourse = await Course.create({
        slug: slugify(req.body.name),
        userId: req.user.id,
        ...req.body
    })
    res.json({success: true, newCourse})
})

// @desc Update and save course
// @route /course/update
// access Private
exports.updateCourse = asyncMiddleware(async (req, res) => {
    const existingCourseTitle = await Course.findOne({where: {slug: slugify(req.body.name)}})
    if (existingCourseTitle) throw new ErrorResponse(400, 'Title is taken.')
    const existingCourse = await Course.findOne({
        where: {id: req.body.id},
        include: [{model: Lesson, attributes: {}, order: [['id']]}]
    })
    await existingCourse.set({...req.body})
    await existingCourse.save()
    res.json({success: true, existingCourse})
})

// @desc Change lessons order
// @route /course/lessons/reorder
// access Private
exports.reOrderLessons = asyncMiddleware(async (req, res) => {
    const {movingLessonId, targetLessonId, courseId} = req.query
    const rawMovingLesson = await Lesson.findOne({where: {id: movingLessonId}, raw: true})
    const rawTargetLesson = await Lesson.findOne({where: {id: targetLessonId}, raw: true})
    const movingLesson = await Lesson.findOne({where: {id: movingLessonId}})
    const targetLesson = await Lesson.findOne({where: {id: targetLessonId}})
    await sequelize.transaction(async transaction => {
        await movingLesson.destroy({transaction})
        await targetLesson.destroy({transaction})
        await Lesson.create({...rawTargetLesson, id: movingLessonId, courseId}, {transaction})
        await Lesson.create({...rawMovingLesson, id: targetLessonId, courseId}, {transaction})
    })
    res.json({success: true, reordered: true})
})

// @desc Get single course
// @route /course/[slug]
// access Private
exports.getSingleCourse = asyncMiddleware(async (req, res) => {
    const {slug} = req.params
    const course = await Course.findOne({
        where: {id: slug},
        include: [{model: Lesson, as: 'Lessons', attributes: {}}],
        order: [[Lesson, 'id']]
    })
    res.json({success: true, course})
})