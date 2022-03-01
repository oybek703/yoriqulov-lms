import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API,
    withCredentials: true
})

export default axiosInstance