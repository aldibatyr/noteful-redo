import React from 'react'

function ValidationError(props){
  if(props.hasError) {
    return (
      <div className='error'>{props.error}</div>
    )
  }
  return <></>
}

export default ValidationError;