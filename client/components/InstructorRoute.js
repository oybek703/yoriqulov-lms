import React, {useContext, useEffect} from 'react'
import {Context} from '../context'
import {useRouter} from 'next/router'
import ProtectedRoute from './ProtectedRoute'

const InstructorRoute = ({children}) => {
    const {state: {user}} = useContext(Context)
    const router = useRouter()
    useEffect(() => {
        if(user && !user.role.includes('Instructor')) router.push('/user/becomeInstructor')
        else router.push(router.route)
    }, [user])

    return (
        <ProtectedRoute>
            {children}
        </ProtectedRoute>
    )
}

export default InstructorRoute