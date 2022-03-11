const {uploadCourseImage} = require('../controllers/course')
const {checkAuth} = require('../middlewares/auth')
const {Router} = require('express')

const router = Router()

router.route('/course/uploadImage').post(checkAuth, uploadCourseImage)

module.exports = router