import styled, { css } from 'styled-components'

const rcSlider = css`
  .rc-slider-rail,
  .rc-slider-track {
    border-radius: 0;
    height: 8px;
  }

  .rc-slider-rail {
    background-color: #f0f0f0;
  }

  .rc-slider-track {
    background: #212121;
  }

  .rc-slider-handle {
    width: 4px;
    height: 24px;
    border-radius: 0;
    border: 0;
    top: 2px;
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
    margin-right: 15px;
  }

  &:last-child {
    margin-left: 15px;
  }
`
