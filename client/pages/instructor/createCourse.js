import React from 'react'
import ProtectedRoute from '../../components/ProtectedRoute'

const CreateCourse = () => {

    return (
        <>
            <ProtectedRoute>
                <div className='card'>
                    <div className='bg-primary p-4 text-white'>
                        <div className='card-body'>
                            <h1 className='text-center'>Create Course</h1>
                        </div>
                    </div>
                </div>
            </ProtectedRoute>
        </>
    )
}

export default CreateCourse

