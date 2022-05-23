import React, {Fragment, useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import axiosInstance from '../../../utils/axiosInstance'
import {getErrorMessage} from '../../../utils'
import {toast} from 'react-toastify'
import Loader from '../../../components/Loader'
import {v4 as uuid} from 'uuid'
import ReactMarkdown from 'react-markdown'

const Course = () => {
    const router = useRouter()
    const {query: {id}} = router
    const [loading, setLoading] = useState(false)
    const [course, setCourse] = useState([])
    useEffect(() => {
        async function getSingleCourse() {
            try {
                setLoading(true)
                const {data: {course}} = await axiosInstance.get(`/api/course/${id}`)
                setLoading(false)
                setCourse(course)
            } catch (e) {
                setLoading(false)
                const message = getErrorMessage(e)
                toast.error(message)
            }
        }

        if (id) getSingleCourse()
        return () => {
            setLoading(false)
        }
    }, [id])
    return (
        <Fragment>
            {loading ? <div className='text-center'>
                <Loader size='lg'/>
            </div> : <div className='container card'>
                <div className='list-group-item d-flex border-0 mb-3 align-items-center justify-content-between'
                     key={uuid()}>
                    <div className='d-flex align-items-center'>
                        <div><img src={course.image} alt={course.title}
                                  style={{width: 70, height: 70, marginRight: 20}}
                                  className='rounded-circle'/></div>
                        <div>
                            <h5 style={{marginBottom: -5}}>{course.name}</h5>
                            <span className='small'>{(course.Lessons || []).length} Lessons</span><br/>
                            {
                                (course.Lessons || []).length < 5
                                    ? <i className='small text-warning'>
                                        At least 5 lessons are required for publishing course.
                                    </i>
                                    : course['published'] ?
                                    <i className='small text-success'>Your course is live in the marketplace</i> :
                                    <i className='small text-info'>
                                        Your course is ready for publishing.
                                    </i>
                            }
                        </div>
                    </div>
                    <div className='d-flex'>
                        <div className='small mx-1 d-flex align-items-baseline font-monospace btn btn-sm btn-dark'
                             title='Edit'>
                            <i className="bi bi-pencil "/>
                        </div>
                        <div className={`small d-flex align-items-baseline font-monospace btn btn-sm btn-success`}
                             title={(course.Lessons || []).length < 5
                                 ? 'Course must have at least 5 lessons to be published.'
                                 : course['published'] ? 'Already published' : 'Publish course'}>
                            <i className='bi bi-calendar-check'/>
                        </div>
                    </div>
                </div>
                <div>
                    <button type="button"
                            className="btn btn-primary"
                            data-bs-toggle="modal"
                            data-bs-target="#uploadLessonModal">
                        <span className='px-1 py-3'>Upload lesson </span>
                        <span className='mt-5'><span className="bi bi-cloud-arrow-up"/></span>
                    </button>
                    <div className="modal fade" id="uploadLessonModal" tabIndex="-1"
                         role="dialog" aria-labelledby="uploadLessonModalTitle" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLongTitle">Add lesson</h5>
                                    <button type="button" className="close btn small btn-danger" data-bs-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    modal body here
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel
                                    </button>
                                    <button type="button" data-bs-dismiss="modal" className="btn btn-primary">Save changes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr/>
                <ReactMarkdown children={course.description}/>
            </div>}
        </Fragment>
    )
}

export default Course
