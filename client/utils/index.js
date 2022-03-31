export function getErrorMessage(e = {}) {
    console.log(e)
    const {response = {}} = e
    const {data = {}} = response
    const {message = 'Seems error occurred.'} = data
    return message
}