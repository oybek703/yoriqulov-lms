import React, {useContext, useEffect} from 'react'
import {Context} from '../../context'
import axiosInstance from '../../utils/axiosInstance'
import Spinner from '../../components/Spinner'
import {getErrorMessage} from '../../utils'
import {toast} from 'react-toastify'

const Callback = () => {
    const {state: {user}} = useContext(Context)
    async function getAccountStatus() {
        try {
            const {data} = await axiosInstance.post('/api/getAccountStatus')
            console.log(data)
            // window.location.href = '/instructor'
        } catch (e) {
            const message = getErrorMessage(e)
            toast.error(message)
        }
    }
    useEffect(() => {
        if(user) {
            getAccountStatus()
        }
    }, [user])
    return (
        <div className='text-center'>
            <Spinner size='lg' style={{width: '6rem', height: '6rem'}}/>
        </div>
    )
}

export default Callback