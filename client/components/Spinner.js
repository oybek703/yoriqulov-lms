import React from 'react'

const Spinner = ({size = 'sm', style = {}}) => {
    return (
        <div className={`spinner-border spinner-border-${size}`} role="status" style={style}>
            <span className="visually-hidden">Loading...</span>
        </div>
    )
}

export default Spinner