import React, {useEffect} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import '../public/css/styles.css'
import TopNav from '../components/TopNav'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {Provider} from '../context'

function MyComponent({Component, pageProps}) {
    useEffect(() => {
        import('bootstrap/dist/js/bootstrap.min')
    }, [])
    return (
        <Provider>
            <ToastContainer position='top-center' theme='colored'/>
            <TopNav/>
            <Component {...pageProps}/>
        </Provider>
    )
}

export default MyComponent