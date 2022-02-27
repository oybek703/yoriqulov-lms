import React from 'react'

const Spinner = ({size = 'sm'}) => {
    return (
        <div className={`spinner-border spinner-border-${size}`} role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    )
}

export default Spinner