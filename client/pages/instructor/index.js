import React from 'react'
import InstructorRoute from '../../components/InstructorRoute'

const CreateCourse = () => {

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
        </>
    )
}

export default CreateCourse

