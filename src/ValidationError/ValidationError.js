import React from 'react'
import PropTypes from 'prop-types';

function ValidationError(props){
  if(props.hasError) {
    return (
      <div className='error'>{props.error}</div>
    )
  }
  return <></>
}

ValidationError.propTypes = {
  hasError: PropTypes.bool,
}

export default ValidationError;