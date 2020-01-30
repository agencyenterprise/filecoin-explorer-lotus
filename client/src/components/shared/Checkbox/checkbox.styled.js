import styled from 'styled-components'

export const Checkbox = styled.label`
  display: block;
  position: relative;
  cursor: pointer;
  font-size: 12px;
  line-height: 20px;
  letter-spacing: 0.02em;
  user-select: none;
  padding-left: 30px;

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;

    &:checked ~ span {
      background-color: #ababab;

      &:after {
        display: block;
      }
    }
  }

  span {
    position: absolute;
    top: 0;
    left: 0;
    height: 20px;
    width: 20px;
    background: #e7e7e7;
    border-radius: 2px;

    &:after {
      content: '';
      position: absolute;
      display: none;
      left: 6px;
      top: 2px;
      width: 5px;
      height: 10px;
      border: solid white;
      border-width: 0 3px 3px 0;
      transform: rotate(45deg);
    }
  }

  &:hover input ~ span {
    background-color: #ccc;
  }
`
