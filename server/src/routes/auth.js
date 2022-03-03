const {checkAuth} = require('../middlewares/auth')
const {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    forgotPassword,
    resetPassword
} = require('../controllers/auth')
const {Router} = require('express')

const router = Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').get(logoutUser)
router.route('/currentUser').get(checkAuth, getCurrentUser)
router.route('/forgotPassword').post(forgotPassword)
router.route('/resetPassword').post(resetPassword)

module.exports = router