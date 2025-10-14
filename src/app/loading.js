import React from 'react'

const loading = () => {
    return (
        <div className='w-screen h-screen absolute top-0 left-0 overflow-hidden flex items-center justify-center bg-[#090909]'>
            <div className="three-body">
                <div className="three-body__dot"></div>
                <div className="three-body__dot"></div>
                <div className="three-body__dot"></div>
            </div>
        </div>
    )
}

export default loading