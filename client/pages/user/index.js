import React, {useContext} from 'react'
import ProtectedRoute from '../../components/ProtectedRoute'
import {Context} from '../../context'

const Dashboard = () => {
    const {state} = useContext(Context)

    return (
        <ProtectedRoute>
            <ProtectedRoute>
                <div className='card'>
                    <div className='bg-primary p-4 text-white'>
                        <div className='card-body'>
                            <h1 className='text-center'>
                                Dashboard - {state.user && state.user.username}
                            </h1>
                        </div>
                    </div>
                </div>
            </ProtectedRoute>
        </ProtectedRoute>
    )
}

export default Dashboard

