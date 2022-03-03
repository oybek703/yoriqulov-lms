import React, {useState} from 'react'
import ProtectedRoute from '../../components/ProtectedRoute'
import Spinner from '../../components/Spinner'
import {getErrorMessage} from '../../utils'
import {toast} from 'react-toastify'
import axiosInstance from '../../utils/axiosInstance'

const BecomeInstructor = () => {
    const [loading, setLoading] = useState(false)
    async function becomeInstructor() {
        try {
            setLoading(true)
            const {data} = await axiosInstance.post('/api/makeInstructor')
            console.log(data)
            window.location.href = data
        } catch (e) {
            const message = getErrorMessage(e)
            setLoading(false)
            toast.error(message)
        }
    }
    return (
        <>
            <ProtectedRoute>
                <div className='card'>
                    <div className='bg-primary p-4 text-white'>
                        <div className='card-body'>
                            <h1 className='text-center'>Become Instructor</h1>
                        </div>
                    </div>
                </div>
                <br/>
                <div className='text-center'>
                    <i className="bi bi-person-video3 display-1"/>
                    <br/>
                    <h2 className='h2'>Setup payout to publish courses on our LMS</h2>
                    <br/>
                    <h5 className='text-warning'>Our LMS system partners with stripe
                        to transfer earnings to your bank account
                    </h5>
                    <br/>
                    <div className='d-grid container'>
                        <button
                            onClick={becomeInstructor.bind(null)}
                            disabled={loading}
                            className='btn btn-primary border-4 rounded-pill'>
                            {loading ? <Spinner/> : <>
                                <i className="bi bi-gear"/>
                                &nbsp;
                                Payout Setup
                            </> }
                        </button>
                    </div>
                    <br/>
                    <h5 className='text-black-50'>
                        You will be redirected to stripe to complete onboard process.
                    </h5>
                </div>
            </ProtectedRoute>
        </>
    )
}

export default BecomeInstructor

