import React from 'react'
import {useRouter} from 'next/router'

const Course = () => {
    const router = useRouter()
    const {query: {id}} = router
    return (
        <h1 className='text-center'>
            {id}
        </h1>
    )
}

export default Course
