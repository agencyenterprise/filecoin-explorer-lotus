import styled from 'styled-components'

export const Orphans = styled.div``
export const Box = styled.div`
  border: 1px solid #d7d7d7;
  border-bottom: 0;
  padding: 16px;
  font-weight: 500;
  font-size: 12px;
  letter-spacing: 0.02em;
  display: flex;

  &:last-child {
    border-bottom: 1px solid #d7d7d7;
  }
`

export const OuterCircle = styled.div`
  border-radius: 50%;
  height: 210px;
  width: 100%;
  background-color: #27346a;
  position: relative;
`

export const InnerCircle = styled.div`
  position: absolute;
  bottom: 0;
  border-radius: 50%;

  background-color: #db5669;
  left: 50%;
  transform: translateX(-50%);

  ${({ size }) => `
    height: ${size}px;
    width: ${size}px;
  `}
`

export const ColorLegend = styled.div`
  background-color: ${({ color }) => color};
  height: 12px;
  width: 12px;
  border-radius: 50%;
  margin-right: 16px;
`

export const Description = styled.div`
  flex: 1;
`
