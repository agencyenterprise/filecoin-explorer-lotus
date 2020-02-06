import styled from 'styled-components'

export const Graph = styled.div`
  background-color: #f7f7f7;
  flex: 1;
  overflow: hidden;
`

export const FetchMore = styled.button`
  background-color: #e9e9e9;
  border: 1px solid #ababab;
  bottom: 50px;
  cursor: pointer;
  font-size: 14px;
  left: 50%;
  outline: none;
  position: absolute;
  padding: 5px 20px;
  z-index: 200;

  &:hover {
    opacity: 0.7;
  }
`
