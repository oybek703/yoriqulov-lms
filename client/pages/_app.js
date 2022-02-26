import React, {useEffect} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import '../public/css/styles.css'
import TopNav from '../components/TopNav'


function MyComponent({Component, pageProps}) {
    useEffect(() => {
        import('bootstrap/dist/js/bootstrap.min')
    }, [])
    return (
        <>
            <TopNav/>
            <Component {...pageProps}/>
        </>
    )
}

export default MyComponent