import React, {useContext, useEffect, useState} from 'react'
import Link from 'next/link'
import {Context} from '../context'
import axiosInstance from '../utils/axiosInstance'
import {getErrorMessage} from '../utils'
import {toast} from 'react-toastify'
import {useRouter} from 'next/router'

const TopNav = () => {
    const [activeLink, setActiveLink] = useState('')
    const {state: {user}, dispatch} = useContext(Context)
    const router = useRouter()
    useEffect(() => {
        setActiveLink(window.location.pathname)
    }, [process.browser && window.location.pathname])
    const logout = async () => {
        try {
            const {data: {message}} = await axiosInstance.get('/api/logout')
            dispatch({type: 'LOGOUT'})
            window.localStorage.removeItem('user')
            toast.success(message)
            router.push('/login')
        } catch (e) {
            const message = getErrorMessage(e)
            toast.error(message)
        }
    }
    return (
        <div className='border-4 d-flex justify-content-between align-items-center pt-2 mx-2'>
            <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                <li className="nav-item mx-2" role="presentation">
                    <Link href='/'>
                        <button className={`nav-link d-flex ${activeLink === '/' ? 'active' : ''}`} id="pills-home-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home"
                                aria-selected="true">
                            <i className="bi bi-window-stack"/>
                            &nbsp;
                            Home
                        </button>
                    </Link>
                </li>
                {/*ROUTES FOR UNAUTHORIZED USERS*/}
                {!user && <>
                    <li className="nav-item mx-2" role="presentation">
                        <Link href='/login'>
                            <button className={`nav-link d-flex ${activeLink === '/login' ? 'active' : ''}`}
                                    id="pills-profile-tab"
                                    data-bs-toggle="pill"
                                    data-bs-target="#pills-profile" type="button" role="tab"
                                    aria-controls="pills-profile"
                                    aria-selected="false">
                                <i className="bi bi-box-arrow-in-left"/>
                                &nbsp;
                                Login
                            </button>
                        </Link>
                    </li>
                    <li className="nav-item mx-2" role="presentation">
                        <Link href='/register'>
                            <button className={`nav-link d-flex ${activeLink === '/register' ? 'active' : ''}`}
                                    id="pills-contact-tab"
                                    data-bs-toggle="pill"
                                    data-bs-target="#pills-contact" type="button" role="tab"
                                    aria-controls="pills-contact"
                                    aria-selected="false">
                                <i className="bi bi-person-plus"/>
                                &nbsp;
                                Register
                            </button>
                        </Link>
                    </li>
                </>}
                {/*ROUTES FOR AUTHORIZED USERS*/}
                {user && user.role && user.role.includes('Instructor')
                    // INSTRUCTOR ROUTES
                    ? <>
                        <li className="nav-item mx-2" role="presentation">
                            <Link href='/instructor/course/create'>
                                <button className={`nav-link d-flex 
                            ${activeLink === '/instructor/course/create' ? 'active' : ''}`}
                                        id="pills-home-tab"
                                        data-bs-toggle="pill"
                                        data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home"
                                        aria-selected="true">
                                    <i className="bi bi-check-square"/>
                                    &nbsp;
                                    Create Course
                                </button>
                            </Link>
                        </li>
                        <li className="nav-item mx-2" role="presentation">
                            <Link href='/instructor'>
                                <button className={`nav-link d-flex 
                            ${activeLink === '/instructor' ? 'active' : ''}`}
                                        id="pills-home-tab"
                                        data-bs-toggle="pill"
                                        data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home"
                                        aria-selected="true">
                                    <i className="bi bi-people"/>
                                    &nbsp;
                                    Instructor
                                </button>
                            </Link>
                        </li>
                    </>
                    // ROUTES FOR SIMPLE USERS
                    : user && user.role && <>
                    <li className="nav-item mx-2" role="presentation">
                        <Link href='/user/becomeInstructor'>
                            <button className={`nav-link d-flex 
                            ${activeLink === '/user/becomeInstructor' ? 'active' : ''}`}
                                    id="pills-home-tab"
                                    data-bs-toggle="pill"
                                    data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home"
                                    aria-selected="true">
                                <i className="bi bi-people"/>
                                &nbsp;
                                Become Instructor
                            </button>
                        </Link>
                    </li>
                </>}
            </ul>
            {/*DROPDOWN FOR AUTHORIZED USERS*/}
            {user && <div className="nav nav-pills mb-3">
                <li className="nav-item dropdown btn-primary p-0 btn-sm text-white">
                    <a className="nav-link nav-pills dropdown-toggle text-white"
                       data-bs-toggle="dropdown" href="#" role="button"
                       aria-expanded="false">
                        {user.username} &nbsp;
                        <i className="bi bi-person"/>
                    </a>
                    <ul className="dropdown-menu">
                        <Link href='/user'>
                            <a className={`dropdown-item 
                            ${activeLink === '/user' && 'active'}`}>
                                Dashboard
                            </a>
                        </Link>
                        <li><a className="dropdown-item" onClick={logout}>Logout</a></li>
                    </ul>
                </li>
            </div>}
        </div>
    )
}

export default TopNav