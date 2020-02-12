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

export const Menu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 8px 0;
`

export const MenuButtonWrapper = styled.div`
  padding: 8px 0;
  cursor: pointer;
`

export const MenuButton = styled.button`
  font-weight: 600;
  font-size: 11px;
  line-height: 16px;
  letter-spacing: 0.02em;
  width: 24px;
  height: 24px;
  background: #f0f0f0;
  border: 0;
  cursor: pointer;
  outline: none;

  ${({ active }) => active && 'background-color: #D7D7D7;'}
`

export const SectionText = styled.div`
  transform: rotate(90deg);
  top: 30px;
  position: relative;
  white-space: nowrap;
  text-transform: uppercase;
`
