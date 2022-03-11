const fs = require('fs')
const {promisify} = require('util')
const firebaseAdmin = require('firebase-admin')
const { v4: uuid } = require('uuid')
const serviceAccount = require('../../config/yoriqulov-lms-firebase-adminsdk-t0tlj-c981854e3d.json')

const saveImage = promisify(fs.writeFile)
const removeImage = promisify(fs.unlink)


const admin = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
})
const storageRef = admin.storage().bucket(process.env.FIREBASE_STORAGE_URL)

async function uploadImageAndGetDownloadUrl(image, oldImage) {
    if(oldImage) await storageRef.file(oldImage).delete()
    const base64Data = new Buffer.from(
        image.replace(
            /^data:image\/\w+;base64,/,
            ''
        ),
        'base64'
    )
    const type = image.split(';')[0].split('/')[1]
    const filename = `${uuid()}.${type}`
    await saveImage(filename, base64Data, 'base64')
    const storage = await storageRef.upload(filename, {
        public: true,
        destination: filename,
        metadata: {
            firebaseStorageDownloadTokens: uuid()
        }
    })
    const downloadUrl = await storage[0].metadata['mediaLink']
    await removeImage(filename)
    return {downloadUrl, filename}
}

module.exports = {
    uploadImageAndGetDownloadUrl
}