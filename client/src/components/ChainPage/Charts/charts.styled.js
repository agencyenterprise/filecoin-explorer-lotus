import styled from 'styled-components'

export const Charts = styled.div`
  flex: 1;
  display: flex;

  #hidden-input {
    display: none;
  }
`

export const Graph = styled.div`
  background-color: #f7f7f7;
  flex: 1;
  overflow: hidden;

  rect.node-label {
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    font-family: Arco Perpetuo Pro;
  }
`

export const SaveSvg = styled.button`
  background-color: #f0f0f0;
  color: #212121;
  cursor: pointer;
  border: 1px solid #d7d7d7;
  outline: none;
  position: absolute;
  padding: 8px 18px;
  z-index: 200;

  font-weight: 600;
  font-size: 12px;
  line-height: 14px;

  top: 16px;
  left: 16px;

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
