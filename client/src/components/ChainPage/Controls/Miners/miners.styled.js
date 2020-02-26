import styled from 'styled-components'

export const Miners = styled.div`
  display: flex;

  > div {
    display: flex;
    flex: 1;
    font-weight: 600;
    font-size: 12px;
    letter-spacing: 0.02em;
    align-items: flex-end;

    span {
      font-weight: 600;
      font-size: 22px;
      display: block;
      width: 50px;
    }
  }
`

export const Miner = styled.div`
  display: flex;
  width: 100%;
  margin: 16px 0;
`

export const Data = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-right: 10px;
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
    background-color: ${({ color }) => color};
  }
`

export const Name = styled.div`
  font-size: 12px;
  margin-top: 5px;
`

export const Amount = styled.div`
  width: 65px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

export const Number = styled.div`
  font-weight: 600;
  font-size: 20px;
`

export const Txs = styled.div`
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.02em;
  margin-top: 5px;
`
