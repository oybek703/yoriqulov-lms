import React, {useEffect, useState} from 'react'
import InstructorRoute from '../../components/InstructorRoute'
import axiosInstance from '../../utils/axiosInstance'
import {getErrorMessage} from '../../utils'
import {toast} from 'react-toastify'
import Loader from '../../components/Loader'
import {v4 as uuid} from 'uuid'
import Link from 'next/link'

const CreateCourse = () => {
    const [loading, setLoading] = useState(false)
    const [courses, setCourses] = useState([])
    useEffect(() => {
        async function getMyCourses() {
            try {
                setLoading(true)
                const {data: {courses}} = await axiosInstance.get('/api/myCourses')
                setLoading(false)
                setCourses(courses)
            } catch (e) {
                setLoading(false)
                const message = getErrorMessage(e)
                toast.error(message)
            }
        }

        getMyCourses()
        return () => {
            setLoading(false)
        }
    }, [])
    return (
        <>
            <InstructorRoute>
                <div className='card'>
                    <div className='bg-primary p-4 text-white'>
                        <div className='card-body'>
                            <h1 className='text-center'>Instructor</h1>
                        </div>
                    </div>
                </div>
            </InstructorRoute>
            <br/>
            {loading ? <div className='text-center'>
                <Loader size='lg'/>
            </div> : <>
                <h2 className='text-center'>My Courses</h2>
                <div className='container'>
                    <div className='list-group border-0'>
                        {courses.map(course => (
                            <li
                                className='list-group-item d-flex border-0 mb-3
                                align-items-center justify-content-between'
                                key={uuid()}>
                                <div className='d-flex'>
                                    <img src={course.image} alt={course.title}
                                         style={{width: 50, height: 50, marginRight: 10}}
                                         className='rounded-circle'/>
                                    <div>
                                        <Link href={`/instructor/course/${course.id}`}
                                              className='list-group-item'>
                                            <h5 className='btn btn-link'>
                                                {course.name}
                                            </h5>
                                        </Link>
                                        <br/>
                                        <span className='small'>0 Lessons</span><br/>
                                        <i className='text-warning small'>
                                            At least 5 lessons are required for publishing course.
                                        </i>
                                    </div>
                                </div>
                                <div className='small font-monospace btn btn-sm btn-warning'>
                                    <i className="bi bi-x-circle"/>
                                </div>
                            </li>
                        ))}
                    </div>
                </div>
            </>}

        </>
    )
}

export default CreateCourse

