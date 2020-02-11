import styled from 'styled-components'

export const Bar = styled.div`
  width: 55px;
  background: #f9f9f9;
  font-family: Suprapower;
  font-weight: 800;
  font-size: 11px;
  line-height: 16px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`

export const RotatedTextWrapper = styled.div`
  position: relative;
`

export const Logo = styled.div`
  position: absolute;
  transform: rotate(90deg) translateX(-140px) translateY(85px);
  white-space: nowrap;
  text-transform: uppercase;
`
