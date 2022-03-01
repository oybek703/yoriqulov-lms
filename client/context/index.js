import {createContext, useEffect, useReducer} from 'react'
import axiosInstance from '../utils/axiosInstance'
import {useRouter} from 'next/router'
import {toast} from 'react-toastify'
import {getErrorMessage} from '../utils'

// initial state
const initialState = {
    user: null
}

// create context
const Context = createContext()

// root reducer
const rootReducer = (state, action) => {
    const {type, payload} = action
    switch (type) {
        case 'LOGIN':
            return {...state, user: payload}
        case 'LOGOUT':
            return {...state, user: null}
        default:
            return state
    }
}

// context provider
const Provider = ({children}) => {
    const [state, dispatch] = useReducer(rootReducer, initialState)
    const router = useRouter()
    useEffect(() => {
        const userFromLocalStorage = JSON.parse(window.localStorage.getItem('user') || null)
        dispatch({
            type: 'LOGIN',
            payload: userFromLocalStorage
        })
    }, [])
    axiosInstance.interceptors.response.use(response => {
        return  response
    }, error => {
        const {response = {}} = error
        if(response.status === 440) {
            return new Promise((resolve, reject) => {
                axiosInstance.get('/api/logout').then(() => {
                    const message = getErrorMessage(error)
                    dispatch({type: 'LOGOUT'})
                    window.localStorage.removeItem('user')
                    toast.error(message)
                    router.push('/login')
                }).catch(err => {
                    console.log(`Axios interceptor error: ${err}`)
                    reject(err)
                })
            })
        }
        return Promise.reject(error)
    })
    useEffect(() => {
        async function getCsrfToken() {
            const {data} = await axiosInstance.get('/api/csrfToken')
            axiosInstance.defaults.headers['X-CSRF-Token'] = data['csrfToken']
        }
        getCsrfToken()
    }, [])
    return (
        <Context.Provider value={{state, dispatch}}>
            {children}
        </Context.Provider>
    )
}

export {Context, Provider}