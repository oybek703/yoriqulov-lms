import axiosInstance from './axiosInstance'

export function getErrorMessage(e = {}) {
    const {response = {}} = e
    const {data = {}} = response
    const {message = 'Seems error occurred.'} = data
    return message
}

