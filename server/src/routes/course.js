const {checkInstructor} = require('../middlewares/instructor')
const {createCourse, getSingleCourse} = require('../controllers/course')
const {checkAuth} = require('../middlewares/auth')
const {Router} = require('express')

const router = Router()

router.route('/course/create').post(checkAuth, checkInstructor, createCourse)
router.route('/course/:slug').get(checkAuth, checkInstructor, getSingleCourse)

module.exports = router