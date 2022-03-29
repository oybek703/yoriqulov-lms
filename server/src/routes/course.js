const {checkInstructor} = require('../middlewares/instructor')
const {uploadCourseImage, createCourse} = require('../controllers/course')
const {checkAuth} = require('../middlewares/auth')
const {Router} = require('express')

const router = Router()

router.route('/course/uploadImage').post(checkAuth, uploadCourseImage)
router.route('/course/create').post(checkAuth, checkInstructor, createCourse)

module.exports = router