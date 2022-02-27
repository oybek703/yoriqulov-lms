import React, {useEffect, useState} from 'react'
import Link from 'next/link'

const TopNav = () => {
    const [activeLink, setActiveLink] = useState('')
    useEffect(() => {
        setActiveLink(window.location.pathname)
    }, [])
    return (
        <div className='px-1 my-2 border-4'>
            <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                <li className="nav-item mx-2" role="presentation">
                    <Link href='/'>
                        <button className={`nav-link d-flex ${activeLink === '/' ? 'active' : ''}`} id="pills-home-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home"
                                aria-selected="true">
                            <i className="bi bi-window-stack"/>
                            &nbsp;
                            App
                        </button>
                    </Link>
                </li>
                <li className="nav-item mx-2" role="presentation">
                    <Link href='/login'>
                        <button className={`nav-link d-flex ${activeLink === '/login' ? 'active' : ''}`} id="pills-profile-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile"
                                aria-selected="false">
                            <i className="bi bi-box-arrow-in-right"/>
                            &nbsp;
                            Login
                        </button>
                    </Link>
                </li>
                <li className="nav-item mx-2" role="presentation">
                    <Link href='/register'>
                        <button className={`nav-link d-flex ${activeLink === '/register' ? 'active' : ''}`} id="pills-contact-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact"
                                aria-selected="false">
                            <i className="bi bi-person-plus"/>
                            &nbsp;
                            Register
                        </button>
                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default TopNav