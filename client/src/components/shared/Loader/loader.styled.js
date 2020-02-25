import styled from 'styled-components'

export const Loader = styled.div`
  align-items: center;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  height: 100%;
  justify-content: center;
  position: fixed;
  width: 100%;
  z-index: 9999;
  font-size: 80px;
  color: #212121;
  flex-direction: column;

  ${({ light }) => light && 'color: white;'}

  span {
    margin-top: 20px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    font-size: 13px;
  }
`
