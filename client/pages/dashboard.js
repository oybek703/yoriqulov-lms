import React, {useContext, useEffect, useState} from 'react'
import ProtectedRoute from '../components/ProtectedRoute'
import {Context} from '../context'
import {getErrorMessage} from '../utils'
import axiosInstance from '../utils/axiosInstance'
import {toast} from 'react-toastify'

const Dashboard = () => {
    const [loading, setLoading] = useState(false)
    const {state} = useContext(Context)

    async function getCurrentUser() {
        try {
            const {data} = await axiosInstance.get('/api/currentUser')
            console.log(data)
            setLoading(false)
        } catch (e) {
            const message = getErrorMessage(e)
            toast.error(message)
            setLoading(false)
        }
    }

    useEffect(() => {
        getCurrentUser()
    }, [])
    return (
        <>
            {loading
                ? 'Loading...'
                : state.user &&  <ProtectedRoute>
                    <div className='card'>
                        <div className='bg-primary p-4 text-white'>
                            <div className='card-body'>
                                <h1 className='text-center'>Dashboard - {state.user.username}</h1>
                            </div>
                        </div>
                    </div>
                </ProtectedRoute>
            }
        </>
    )
}

export default Dashboard

