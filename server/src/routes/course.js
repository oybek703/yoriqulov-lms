const {checkInstructor} = require('../middlewares/instructor')
const {createCourse} = require('../controllers/course')
const {checkAuth} = require('../middlewares/auth')
const {Router} = require('express')

const router = Router()

router.route('/course/create').post(checkAuth, checkInstructor, createCourse)

module.exports = router