import styled from 'styled-components'

export const RangeInputs = styled.div`
  display: flex;
  justify-content: space-between;

  > div {
    align-items: flex-end;
  }

  input {
    outline: none;
    border: 0;
    font-weight: bold;
    font-size: 24px;
    line-height: 24px;
    max-width: 75px;
  }

  span {
    font-weight: 600;
    font-size: 12px;
    line-height: 14px;
    letter-spacing: 0.02em;
    margin-left: 5px;
  }
`
