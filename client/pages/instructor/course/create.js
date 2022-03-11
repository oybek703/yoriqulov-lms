import React, {useState} from 'react'
import InstructorRoute from '../../../components/InstructorRoute'
import Spinner from '../../../components/Spinner'
import axiosInstance from '../../../utils/axiosInstance'
import FileResizer from 'react-image-file-resizer'
import {getErrorMessage} from '../../../utils'
import {toast} from 'react-toastify'

const CreateCourse = () => {
    const [loading, setLoading] = useState(false)
    const [upLoading, setUpLoading] = useState(false)
    const [file, setFile] = useState('')
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
            if (file) await uploadImage(file)
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
    async function uploadImage(file) {
        FileResizer.imageFileResizer(
            file,
            720,
            500,
            'JPEG',
            100,
            0,
            async uri => {
                try {
                    setUpLoading(true)
                    await axiosInstance.post(
                        '/api/course/uploadImage',
                        {image: uri}
                    )
                    setUpLoading(false)
                } catch (e) {
                    const message = getErrorMessage(e)
                    setUpLoading(false)
                    toast.error(message)
                }
            })
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

