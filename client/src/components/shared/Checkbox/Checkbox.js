import React from 'react'
import { Checkbox } from './checkbox.styled'

const CheckboxComponent = ({ children, ...props }) => {
  return (
    <Checkbox>
      <input type="checkbox" {...props} />
      <span />
      {children}
    </Checkbox>
  )
}

export { CheckboxComponent as Checkbox }
