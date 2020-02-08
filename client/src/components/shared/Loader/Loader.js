import React from 'react'
import { Loader } from './loader.styled'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const LoaderComponent = () => {
  return (
    <Loader>
      <FontAwesomeIcon icon={faCircleNotch} spin />
      <span>Loading...</span>
    </Loader>
  )
}

export { LoaderComponent as Loader }
