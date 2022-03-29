const asyncMiddleware = require('../utils/async')
const {uploadImageAndGetDownloadUrl} = require('../utils/handleImageUploads')

// @desc Upload course image
// @route /course/uploadImage
// access Private
exports.uploadCourseImage = asyncMiddleware(async (req, res) => {
    const {image, oldImage} = req.body
    const response = await uploadImageAndGetDownloadUrl(image, oldImage)
    res.json({success: true, message: response})
})

// @desc Create and save course
// @route /course/create
// access Private
exports.createCourse = asyncMiddleware(async (req, res) => {
    res.json({success: true, message: 'ceate new course'})
})