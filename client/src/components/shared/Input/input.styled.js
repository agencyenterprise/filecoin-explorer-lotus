import styled from 'styled-components'

export const Input = styled.input`
  border: 1px solid #c7c7c7;
  border-left: 4px solid #c7c7c7;
  box-sizing: border-box;
  color: #212121;
  font-family: Arco Perpetuo Pro;
  font-size: 12px;
  font-weight: 300;
  letter-spacing: 0.02em;
  line-height: 16px;
  padding: 12px 8px;
  width: 100%;
  margin: 8px 0;
  outline: none;

  ::-webkit-input-placeholder {
    /* Chrome/Opera/Safari */
    color: #ababab;
  }
  ::-moz-placeholder {
    /* Firefox 19+ */
    color: #ababab;
  }
  :-ms-input-placeholder {
    /* IE 10+ */
    color: #ababab;
  }
  :-moz-placeholder {
    /* Firefox 18- */
    color: #ababab;
  }

  &:focus {
    border-color: #9ae8ea;
  }
`
