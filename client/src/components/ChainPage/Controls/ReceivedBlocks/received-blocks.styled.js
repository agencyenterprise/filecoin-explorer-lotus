import styled from 'styled-components'

export const ReceivedBlocks = styled.div`
  display: flex;
  width: 100%;
  margin: 24px 0;
`

export const Amount = styled.div`
  display: flex;
  flex-direction: column;
`

export const Number = styled.div`
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
`

export const Blocks = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: 0.02em;
  margin-top: 5px;
`

export const Data = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: 20px;
`

export const ProgressBar = styled.div`
  height: 24px;
  background: #f0f0f0;
  flex: 1;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    height: 100%;
    left: 0;
    width: ${({ percentage }) => `${percentage}%`};
    background-color: #c4c4c4;
  }
`

export const Description = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: 0.02em;
  margin-top: 5px;
`

export const Kind = styled.div``

export const Percentage = styled.div`
  flex: 1;
  text-align: right;
`
