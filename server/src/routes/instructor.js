const {checkInstructor} = require('../middlewares/instructor')
const {
    makeInstructor,
    getAccountStatus, getInstructorCourses
} = require('../controllers/instructor')
const {checkAuth} = require('../middlewares/auth')
const {Router} = require('express')

const router = Router()

router.route('/makeInstructor').post(checkAuth, makeInstructor)
router.route('/getAccountStatus').post(checkAuth, getAccountStatus)
router.route('/myCourses').get(checkAuth, checkInstructor, getInstructorCourses)

module.exports = router