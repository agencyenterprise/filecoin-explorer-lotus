import styled from 'styled-components'

export const NodeModal = styled.div`
  width: 336px;
  max-height: calc(100% - 32px);
  position: absolute;
  top: 16px;
  right: 16px;
  background: #f7f7f7;
  border: 1px solid #d7d7d7;
  word-break: break-all;
  overflow-y: auto;
`

export const Block = styled.div`
  border-bottom: 1px dashed #d7d7d7;
  padding: 16px;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.02em;
  color: #424242;
  display: flex;

  ${({ aligned }) => aligned && 'align-items: center;'}
  ${({ spaced }) => spaced && 'justify-content: space-between;'}
  ${({ borderless }) => borderless && 'border-bottom: 0;'}
  ${({ hoverable }) =>
    hoverable &&
    `
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  `}

`

export const Title = styled.div`
  width: 96px;
  font-weight: 600;
`

export const Content = styled.div`
  flex: 1;
  color: #848484;
`

export const CloseButton = styled.img`
  padding: 5px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`

export const PurpleLink = styled.div`
  color: #4c4da7;
`
