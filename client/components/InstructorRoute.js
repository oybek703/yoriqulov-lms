import React, {useContext, useEffect} from 'react'
import {Context} from '../context'
import {useRouter} from 'next/router'

const InstructorRoute = ({children}) => {
    const {state: {user}} = useContext(Context)
    const router = useRouter()
    useEffect(() => {
        if(user && !user.role.includes('Instructor')) router.push('/user/becomeInstructor')
        else router.push(router.route)
    }, [user])

    return (
        <>
            {children}
        </>
    )
}

export default InstructorRoute