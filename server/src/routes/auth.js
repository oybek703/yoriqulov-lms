const {registerUser} = require('../controllers/auth')
const {Router} = require('express')

const router = Router()

router.route('/register').post(registerUser)

module.exports = router