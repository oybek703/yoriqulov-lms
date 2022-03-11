const asyncMiddleware = require('../utils/async')
const {uploadImageAndGetDownloadUrl} = require('../utils/handleImageUploads')

// @desc Upload course image
// @route /course/uploadImage
// access Private
exports.uploadCourseImage = asyncMiddleware(async (req, res) => {
    const {image, oldImage} = req.body
    const response = await uploadImageAndGetDownloadUrl(image, oldImage)
    console.log(response)
    res.json({success: true, message: response})
})