import styled, { css } from 'styled-components'

const rcSlider = css`
  .rc-slider {
    height: 35px;
  }

  .rc-slider-rail,
  .rc-slider-track {
    border-radius: 0;
    height: 24px;
  }

  .rc-slider-track {
    background: #c4c4c4;
  }

  .rc-slider-handle {
    width: 2px;
    height: 32px;
    border-radius: 0;
    border: 0;
    background: #ababab;
  }
`

export const Controls = styled.div`
  width: 305px;
  border-left: 1px solid #d7d7d7;
  position: relative;

  /* rc-slider */
  ${rcSlider}
`

export const DashedLine = styled.div`
  border: 1px dashed #d7d7d7;
  margin: 20px -24px;
`

export const Heading = styled.h1`
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: 0.02em;
`

export const Title = styled.h3`
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.02em;
  margin-bottom: 8px;
`

export const Description = styled.p`
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.02em;
  margin-top: 10px;
`