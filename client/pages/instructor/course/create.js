import React, {useState} from 'react'
import InstructorRoute from '../../../components/InstructorRoute'
import Spinner from '../../../components/Spinner'
import axiosInstance from '../../../utils/axiosInstance'
import {getErrorMessage} from '../../../utils'
import {toast} from 'react-toastify'
import firebaseApp from '../../../utils/firebase'
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage'
import {v4 as uuid} from 'uuid'

const CreateCourse = () => {
    const [uploadProgress, setUploadProgress] = useState(0)
    const [loading, setLoading] = useState(false)
    const [upLoading, setUpLoading] = useState(false)
    const [file, setFile] = useState('')
    const [imageDownloadUrl, setImageDownloadUrl] = useState('')
    const [formValues, setFormValues] = useState({
        name: '',
        description: '',
        price: 9.99,
        paid: false
    })
    const [preview, setPreview] = useState('')

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            if(!file) return toast.error('Image is required!')
            setLoading(true)
            if (file) uploadImage(file)
            await axiosInstance.post('/api/course/create', {
                ...formValues,
                imageDownloadUrl
            })
            console.log(imageDownloadUrl)
            setImageDownloadUrl('')
            setLoading(false)
        } catch (e) {
            const message = getErrorMessage(e)
            toast.error(message)
            setLoading(false)
        }
    }
    const handleChange = e => {
        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value
        })
    }
    function uploadImage(file) {
        const storage = getStorage(firebaseApp)
        const storageRef = ref(storage, 'lms')
        const uploadTask = uploadBytesResumable(storageRef, file)
        setUpLoading(true)
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
                toast.error(error.message)
            },
            () => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageDownloadUrl(downloadURL)
                    setUploadProgress(0)
                    setUpLoading(false)
                })
            }
        )
    }
    const handleImageChange = async e => {
        const file = e.target.files[0]
        setFile(file)
        setPreview(window.URL.createObjectURL(e.target.files[0]))
    }

    return (
        <InstructorRoute>
            <div className='card mb-3'>
                <div className='bg-primary p-4 text-white'>
                    <div className='card-body'>
                        <h1 className='text-center'>Create Course</h1>
                    </div>
                </div>
            </div>
            <form onSubmit={handleSubmit} className='container'>
                <input type="text"
                       className='form-control mb-3 d-block'
                       placeholder='Course name'
                       name='name'
                       required
                       autoComplete='off'
                       onChange={handleChange}
                       value={formValues['name']}/>
                <textarea
                    className='form-control mb-3'
                    placeholder='Course description...'
                    value={formValues['description']}
                    onChange={handleChange}
                    name="description" rows="5"/>
                <div className='d-flex mb-3 align-items-center'>
                    <div className='form-check'>
                        <input
                            type="radio"
                            defaultChecked
                            className='form-check-input'
                            value='false'
                            onChange={handleChange}
                            name='paid' id='free'/>
                        <label className="form-check-label" htmlFor="free">
                            Free
                        </label>
                    </div>
                    <div className='form-check mx-5'>
                        <input
                            type="radio"
                            className='form-check-input'
                            value='true'
                            onChange={handleChange}
                            name='paid' id='paid'/>
                        <label className="form-check-label" htmlFor="paid">
                            Paid
                        </label>
                    </div>
                    {formValues.paid === 'true' && <>
                        <input type="number"
                               id='price'
                               name='price'
                               className='form-control'
                               placeholder='Course price'
                               min={3.99}
                               max={99999.999}
                               onChange={handleChange}
                               value={formValues['price']}/>
                    </>}
                </div>
                <div className="my-3 d-flex align-items-center">
                    <label htmlFor="imageFile"
                           className={`btn btn-outline-dark form-label ${upLoading && 'disabled'}`}>
                        Upload Image
                        <input
                            hidden
                            accept='image/*'
                            onChange={handleImageChange}
                            className="form-control"
                            type="file"
                            id="imageFile"/>
                    </label>
                    {preview &&<img src={preview}
                                          alt="Course Image preview"
                                          style={{
                                              width: 40,
                                              height: 40,
                                              borderRadius: '50%',
                                              marginLeft: 20
                                          }}/>
                    }
                </div>
                {upLoading && <>
                    <div className="progress">
                        <div className="progress-bar progress-bar-animated progress-bar-striped" role="progressbar"
                             style={{width: `${uploadProgress}%`}} aria-valuenow={uploadProgress}
                             aria-valuemin="0" aria-valuemax="100">{uploadProgress}%
                        </div>
                    </div>
                    <br/></>}
                <button
                    disabled={loading || upLoading}
                    className='btn btn-primary rounded-pill'>
                    Save & Continue
                    {(loading || upLoading) && <Spinner style={{marginLeft: 10}}/>}
                </button>
            </form>
        </InstructorRoute>
    )
}

export default CreateCourse

