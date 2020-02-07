import styled from 'styled-components'

export const Block = styled.div`
  padding: 22px 24px;
  border-bottom: 1px solid #d7d7d7;

  ${({ dark }) =>
    dark &&
    `
    background-color: #212121;
    color: white;
  `}
`
