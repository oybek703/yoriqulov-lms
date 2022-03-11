const {
    makeInstructor,
    getAccountStatus
} = require('../controllers/instructor')
const {checkAuth} = require('../middlewares/auth')
const {Router} = require('express')

const router = Router()

router.route('/makeInstructor').post(checkAuth, makeInstructor)
router.route('/getAccountStatus').post(checkAuth, getAccountStatus)

module.exports = router