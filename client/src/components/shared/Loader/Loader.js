import React from 'react'
import { Loader } from './loader.styled'

const LoaderComponent = () => {
  return (
    <Loader>
      <span uk-spinner="ratio: 4.5"></span>
    </Loader>
  )
}

export { LoaderComponent as Loader }
