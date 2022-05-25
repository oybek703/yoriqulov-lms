const {checkInstructor} = require('../middlewares/instructor')
const {createCourse, getSingleCourse, updateCourse, reOrderLessons} = require('../controllers/course')
const {checkAuth} = require('../middlewares/auth')
const {Router} = require('express')

const router = Router()

router.route('/course/create').post(checkAuth, checkInstructor, createCourse)
router.route('/course/update').put(checkAuth, checkInstructor, updateCourse)
router.route('/course/lessons/reorder').get(checkAuth, checkInstructor, reOrderLessons)
router.route('/course/:slug').get(checkAuth, checkInstructor, getSingleCourse)

module.exports = router