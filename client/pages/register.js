import React, {useState} from 'react'

const Register = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const handleSubmit = event => {
        event.preventDefault()
        console.table({name, email, password})
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
                    <button className='col-8 btn p-2 btn-outline-primary' type='submit'>Submit</button>
                </form>
            </div>
        </>
    )
}

export default Register