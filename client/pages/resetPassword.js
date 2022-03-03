import React, {useContext, useEffect, useState} from 'react'
import Spinner from '../components/Spinner'
import axiosInstance from '../utils/axiosInstance'
import {toast} from 'react-toastify'
import {useRouter} from 'next/router'
import {getErrorMessage} from '../utils'
import {Context} from '../context'

const ResetPassword = () => {
    const {state: {user}} = useContext(Context)
    const [email, setEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [code, setCode] = useState('')
    const [loading, setLoading] = useState(false)
    const [ok, setOk] = useState(false)
    const router = useRouter()
    const handleSubmit = async event => {
        event.preventDefault()
        if(ok) {
            try {
                setLoading(true)
                const {data: {message}} = await axiosInstance.post(
                    '/api/resetPassword',
                    {email, code, newPassword}
                    )
                toast.success(message)
                await router.push('/login')
            } catch (e) {
                const message = getErrorMessage(e)
                toast.error(message)
                setLoading(false)
            }
        } else {
            try {
                setLoading(true)
                await axiosInstance.post('/api/forgotPassword', {email})
                setLoading(false)
                setOk(true)
                toast.success(`Reset password code sent to ${email}.`)
            } catch (e) {
                const message = getErrorMessage(e)
                setOk(false)
                toast.error(message)
                setLoading(false)
            }
        }
    }
    useEffect(() => {
        if(user) router.push('/')
    }, [user])
    return (
        <>
            <h1 className='card rounded-0 p-4 bg-primary text-center text-white'>
                Reset Password
            </h1>
            <div className='container pt-3'>
                <form onSubmit={handleSubmit} className='row justify-content-center'>
                    <input required value={email}
                           autoComplete='off'
                           onChange={({target: {value}}) => setEmail(value)}
                           className='col-8 mb-4 p-2' type="email" placeholder='Enter email'/>
                    {ok && <>
                        <input required value={code}
                               autoComplete='off'
                               onChange={({target: {value}}) => setCode(value)}
                               className='col-8 mb-4 p-2' type="text" placeholder='Enter code'/>
                        <input required value={newPassword}
                               autoComplete='new-password'
                               onChange={({target: {value}}) => setNewPassword(value)}
                               className='col-8 mb-4 p-2' type="password"
                               placeholder='Enter new password'/>
                    </>
                    }
                    <button className='col-8 btn p-2 btn-outline-primary'
                            disabled={loading || !email}
                            type='submit'>
                        {loading ? <Spinner/> : 'Submit'}
                    </button>
                </form>
            </div>
        </>
    )
}

export default ResetPassword