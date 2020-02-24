import styled from 'styled-components'

export const SliderCheckbox = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  input {
    margin: 0px;
    margin-top: 1px;
    cursor: pointer;
    opacity: 0;
    position: absolute;
    z-index: 1;
    top: 0px;
    left: 0px;
    width: 40px;
    height: 20px;

    &:checked + label:after {
      left: 21px;
      background-color: #212121;
    }

    &:disabled {
      cursor: not-allowed;
    }
  }

  label {
    position: relative;
    padding-left: 56px;
    font-family: Arco Perpetuo Pro;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.02em;
    flex: 1;

    cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};

    &:before,
    &:after {
      position: absolute;
      border-radius: 10px;
      transition: background-color 0.3s, left 0.3s;
    }

    &:before {
      content: '';
      color: #fff;
      box-sizing: border-box;
      padding-left: 23px;
      font-size: 12px;
      line-height: 20px;
      background-color: #e7e7e7;
      left: 0px;
      top: 0px;
      height: 20px;
      width: 40px;
      border-radius: 10px;
    }

    &:after {
      content: '';
      letter-spacing: 20px;
      background: #fff;
      left: 1px;
      top: 1px;
      height: 18px;
      width: 18px;
    }
  }
`

export const Indicator = styled.span`
  color: #c7c7c7;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.02em;

  ${({ active }) => active && 'color: #212121;'}
`
