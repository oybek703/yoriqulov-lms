import React, {useContext, useEffect} from 'react'
import {Context} from '../context'
import {useRouter} from 'next/router'

const ProtectedRoute = ({children}) => {
    const {state: {user}} = useContext(Context)
    const router = useRouter()
    useEffect(() => {
        if(!user) router.push('/login')
    }, [user])

    return (
        <>
            {children}
        </>
    )
}

export default ProtectedRoute