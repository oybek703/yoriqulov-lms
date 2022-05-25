export function getErrorMessage(e = {}) {
    console.log(e)
    if(typeof e === 'string') return e
    const {response = {}} = e
    const {data = {}} = response
    const {message = 'Seems error occurred.'} = data
    return message
}