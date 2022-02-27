import React, {useState} from 'react'
import {toast} from 'react-toastify'
import Spinner from '../components/Spinner'
import axiosInstance from '../utils/axiosInstance'

const Register = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const handleSubmit = async event => {
        event.preventDefault()
        try {
            setLoading(true)
            const {data} = await axiosInstance.post(
                '/register',
                {name, email, password}
            )
            console.log(data)
            toast.success('Registration successfully.')
            setLoading(false)
        } catch (e) {
            const {response = {}} = e
            const {data = {}} = response
            const {message = 'Seems error occurred.'} = data
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
                           onChange={({target:{value}}) => setName(value)}
                           className='col-8 mb-4 p-2' type="text" placeholder='Enter name'/>
                    <input required value={email}
                           onChange={({target:{value}}) => setEmail(value)}
                           className='col-8 mb-4 p-2' type="email" placeholder='Enter email'/>
                    <input required value={password}
                           onChange={({target:{value}}) => setPassword(value)}
                           className='col-8 mb-4 p-2' type="password" placeholder='Enter password'/>
                    <button className='col-8 btn p-2 btn-outline-primary'
                            disabled={loading || !name || !email}
                            type='submit'>
                        {loading ? <Spinner/> : 'Submit'}
                    </button>
                </form>
            </div>
        </>
    )
}

export default Register