import React, {useState} from 'react'
import {initializeApp} from 'firebase/app'
import firebaseConfig from '../utils/firebase'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {v4 as uuid} from 'uuid'
import {toast} from 'react-toastify'
import {getErrorMessage} from '../utils'
import Spinner from './Spinner'
import axiosInstance from '../utils/axiosInstance'

const AddLessonForm = ({courseId = ''}) => {
    const [uploadProgress, setUploadProgress] = useState(0)
    const [loading, setLoading] = useState(false)
    const [upLoading, setUpLoading] = useState(false)
    const [formValues, setFormValues] = useState({title: '', content: '', file: ''})

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            if (!formValues.file) return toast.error('Video is required!')
            setLoading(true)
            let image
            if (formValues.file) image = await uploadLesson()
            setLoading(false)
            const {data} = await axiosInstance.post('/api/lessons/add', {
                ...formValues,
                courseId,
                file: image
            })
            console.log(data)
            setFormValues({title: '', content: '', file: ''})
        } catch (e) {
            const message = getErrorMessage(e)
            toast.error(message)
            setLoading(false)
        }
    }

    async function uploadLesson() {
        const firebaseApp = initializeApp(firebaseConfig)
        const storage = getStorage(firebaseApp)
        const storageRef = ref(storage, `/lessons/${uuid()}_${formValues.file.name.toLowerCase()}`)
        const uploadTask = uploadBytesResumable(storageRef, formValues.file)
        setUpLoading(true)
        return new Promise(((resolve, reject) => {
            uploadTask.on('state_changed',
                (snapshot) => {
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                    setUploadProgress(progress)
                },
                (error) => {
                    console.log(error)
                    setUpLoading(false)
                    reject(error)
                },
                () => {
                    // Handle successful uploads on complete
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setUploadProgress(0)
                        setUpLoading(false)
                        resolve(downloadURL)
                    })
                }
            )
        }))
    }

    function handleChange(e) {
        if (e.target.name === 'file') {
            return setFormValues({...formValues, file: e.target.files[0]})
        }
        setFormValues({...formValues, [e.target.name]: e.target.value})
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input value={formValues['title']}
                           onChange={handleChange}
                           required
                           type="text"
                           name='title'
                           className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                           placeholder="Enter title..."/>
                </div>
                <hr/>
                <div className="form-group">
                    <textarea required
                              value={formValues['content']}
                              onChange={handleChange}
                              placeholder='Enter lesson content...'
                              name='content'
                              className="form-control" id="lessonContent" rows="3"/>
                </div>
                <hr/>
                <div className="custom-file bg-gradient d-flex">
                    <input onChange={handleChange}
                           name='file'
                           disabled={loading || upLoading}
                           hidden
                           type="file" required className="custom-file-input" id="customFile"/>
                    <label tabIndex="0"
                        className="custom-file-label btn-sm btn-success"
                        htmlFor="customFile">
                        {(formValues.file && formValues.file.name) || 'Choose video file'}</label>
                </div>
                <br/>
                {upLoading && <>
                    <div className="progress">
                        <div className="progress-bar progress-bar-animated progress-bar-striped" role="progressbar"
                             style={{width: `${uploadProgress}%`}} aria-valuenow={uploadProgress}
                             aria-valuemin="0" aria-valuemax="100">{uploadProgress}%
                        </div>
                    </div>
                    <br/></>}
                <br/>
                <button type='submit' disabled={loading || upLoading}
                        className='btn d-block btn-dark'>
                    Save
                    {(loading || upLoading) && <Spinner style={{marginLeft: 10}}/>}
                </button>
            </form>
        </>
    )
}

export default AddLessonForm