import React, {useContext, useEffect, useState} from 'react'
import Spinner from '../components/Spinner'
import Link from 'next/link'
import axiosInstance from '../utils/axiosInstance'
import {toast} from 'react-toastify'
import {Context} from '../context'
import {useRouter} from 'next/router'
import {getErrorMessage} from '../utils'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const {state, dispatch} = useContext(Context)
    const router = useRouter()
    useEffect(() => {
        if(state.user) router.push('/user')
    }, [state])
    const handleSubmit = async event => {
        event.preventDefault()
        try {
            setLoading(true)
            const {data: {user}} = await axiosInstance.post(
                '/api/login',
                {email, password}
            )
            dispatch({type: 'LOGIN', payload: user})
            window.localStorage.setItem('user', JSON.stringify(user))
            toast.success('Login successful.')
            setLoading(false)
        } catch (e) {
            const message = getErrorMessage(e)
            toast.error(message)
            setLoading(false)
        }
    }

    return (
        <>
            <h1 className='card rounded-0 p-4 bg-primary text-center text-white'>
                Login
            </h1>
            <div className='container pt-3'>
                <form onSubmit={handleSubmit} className='row justify-content-center'>
                    <input required value={email}
                           onChange={({target: {value}}) => setEmail(value)}
                           className='col-8 mb-4 p-2' type="email" placeholder='Enter email'/>
                    <input required value={password}
                           onChange={({target: {value}}) => setPassword(value)}
                           className='col-8 mb-4 p-2' type="password" placeholder='Enter password'/>
                    <button className='col-8 btn p-2 btn-outline-primary'
                            disabled={loading || !email || !password}
                            type='submit'>
                        {loading ? <Spinner/> : 'Submit'}
                    </button>
                    <div className='text-center mt-4'>
                        No account? &nbsp;
                        <Link href='/register'>
                            <a>Register</a>
                        </Link>
                    </div>
                    <div className='text-center mt-4'>
                        Forgot password? &nbsp;
                        <Link href='/resetPassword'>
                            <a>Reset password</a>
                        </Link>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Login