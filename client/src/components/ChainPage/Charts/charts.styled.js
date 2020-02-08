import styled from 'styled-components'

export const Graph = styled.div`
  background-color: #f7f7f7;
  flex: 1;
  overflow: hidden;
`

export const SaveSvg = styled.button`
  background-color: #212121;
  color: white;
  bottom: 10px;
  cursor: pointer;
  border: 0;
  font-size: 12px;
  font-weight: 500;
  right: 10px;
  outline: none;
  position: absolute;
  padding: 8px 18px;
  z-index: 200;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.7;
    cursor: default;
    background-color: #212121;
    color: #e9e9e9;
  }
`
