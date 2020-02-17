import styled, { css } from 'styled-components'

const rcSlider = css`
  .rc-slider {
    padding: 0;
  }

  .rc-slider-rail,
  .rc-slider-track {
    border-radius: 0;
    height: 16px;
  }

  .rc-slider-rail {
    background-color: #f0f0f0;
  }

  .rc-slider-track {
    background: #848484;
  }

  .rc-slider-handle {
    width: 4px;
    height: 16px;
    border-radius: 0;
    border: 0;
    top: 5px;
    background: #212121;
  }
`

export const RangeContainer = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 24px;

  ${rcSlider}
`

export const RangeNumber = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;

  &:first-child {
    margin-right: 25px;
  }

  &:last-child {
    margin-left: 25px;
  }
`

export const Spacer = styled.div`
  flex: 1;
`
