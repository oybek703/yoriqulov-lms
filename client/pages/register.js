import React, {useContext, useEffect, useState} from 'react'
import {toast} from 'react-toastify'
import Spinner from '../components/Spinner'
import axiosInstance from '../utils/axiosInstance'
import Link from 'next/link'
import {getErrorMessage} from '../utils'
import {useRouter} from 'next/router'
import {Context} from '../context'

const Register = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const {state} = useContext(Context)
    useEffect(() => {
        if (state.user) router.push('/')
    }, [state])
    const handleSubmit = async event => {
        event.preventDefault()
        try {
            setLoading(true)
            await axiosInstance.post(
                '/api/register',
                {name, email, password}
            )
            toast.success('Registration successful.')
            router.push('/login')
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
                Register
            </h1>
            <div className='container pt-3'>
                <form onSubmit={handleSubmit} className='row justify-content-center'>
                    <input required value={name}
                           onChange={({target: {value}}) => setName(value)}
                           className='col-8 mb-4 p-2' type="text" placeholder='Enter name'/>
                    <input required value={email}
                           onChange={({target: {value}}) => setEmail(value)}
                           className='col-8 mb-4 p-2' type="email" placeholder='Enter email'/>
                    <input required value={password}
                           onChange={({target: {value}}) => setPassword(value)}
                           className='col-8 mb-4 p-2' type="password" placeholder='Enter password'/>
                    <button className='col-8 btn p-2 btn-outline-primary'
                            disabled={loading || !name || !email || !password}
                            type='submit'>
                        {loading ? <Spinner/> : 'Submit'}
                    </button>
                    <div className='text-center mt-4'>
                        Already have account? &nbsp;
                        <Link href='/login'>
                            <a>Login</a>
                        </Link>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Register