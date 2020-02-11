import React from 'react'
import { Bar, Logo, RotatedTextWrapper } from './bar.styled'

const BarComponent = () => {
  return (
    <Bar>
      <div />
      <RotatedTextWrapper>
        <Logo>Filecoin Blockchain explorer</Logo>
      </RotatedTextWrapper>
    </Bar>
  )
}

export { BarComponent as Bar }
