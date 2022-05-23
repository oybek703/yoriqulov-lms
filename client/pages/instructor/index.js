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
                        {!courses.length
                            ? <h6 className='text-black text-center'>You have not created any courses yet.</h6>
                            : courses.map(course => (
                                <div
                                    className='list-group-item d-flex border-0 mb-3
                                align-items-center justify-content-between'
                                    key={uuid()}>
                                    <div className='d-flex align-items-center'>
                                        <div><img src={course.image} alt={course.title}
                                                  style={{width: 70, height: 70, marginRight: 20}}
                                                  className='rounded-circle'/></div>
                                        <div>
                                            <Link href={`/instructor/course/${course.id}`}
                                                  className='list-group-item btn-link'>{course.name}</Link>
                                            <br/>
                                            <span className='small'>{course.lessons} Lessons</span><br/>
                                            {
                                                course['lessons'] < 5
                                                    ? <i className='small text-warning'>
                                                        At least 5 lessons are required for publishing course.
                                                    </i>
                                                    : course['published'] ?
                                                    <i className='small text-success'>Your course is live in the
                                                        marketplace</i> :
                                                    <i className='small text-info'>
                                                        Your course is ready for publishing.
                                                    </i>
                                            }
                                        </div>
                                    </div>
                                    <div className={`small d-flex align-items-baseline font-monospace btn btn-sm 
                                ${course['published'] ? 'btn-success' : 'btn-warning'}`}>
                                        {course['published'] ? <i className="bi bi-calendar-check"/> :
                                            <i className="bi bi-patch-exclamation"/>}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </>
            }
        </>
    )
}

export default CreateCourse

