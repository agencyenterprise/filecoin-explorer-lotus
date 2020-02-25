import styled from 'styled-components'

export const LaGraphaWrapper = styled.div`
  display: flex;
  flex: 1;
  position: relative;
  overflow: hidden;

  #hidden-input {
    display: none;
  }
`

export const LaGrapha = styled.div`
  background-color: #ffffff;
  flex: 1;
  overflow: hidden;
`

export const SaveGraph = styled.button`
  background-color: #ffffff;
  color: #212121;
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: 0.02em;
  cursor: pointer;
  border: 1px solid #d7d7d7;
  outline: none;
  position: absolute;
  padding: 8px 18px;
  z-index: 200;
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

  svg {
    margin-right: 5px;
  }
`
