import React from 'react'
// import Loading from '../images/Spinner@1x-1.0s-200px-200px.gif';
import Loading from './Rolling@1x-1.0s-200px-200px.gif'

const Spinner = () => {
    return (
      <div className="flex items-center justify-center">
        <img className="my-3" src={Loading} alt="Loading" />
      </div>
    )
}

export default Spinner;