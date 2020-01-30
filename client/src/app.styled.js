import styled, { css } from 'styled-components'

const d3Tip = css`
  .d3-tip {
    line-height: 1;
    padding: 12px;
    background: rgba(0, 0, 0, 0.8);
    color: #fff;
    border-radius: 2px;
    margin-top: -9px;
    overflow: hidden;

    &:after {
      box-sizing: border-box;
      display: inline;
      font-size: 10px;
      width: 100%;
      line-height: 1;
      color: rgba(0, 0, 0, 0.8);
      content: '\25BC';
      position: absolute;
      text-align: center;
    }

    .n:after {
      margin: -1px 0 0 0;
      top: 100%;
      left: 0;
    }

    table tr td {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      .react-datepicker-wrapper {
        width: 100%;
      }

      &::first-child {
        font-weight: bold;
        padding-right: 25px;
      }
    }
  }
`

export const App = styled.div`
  html,
  body,
  #root,
  #main {
    min-height: 100%;
  }

  body {
    font-family: Arco Perpetuo Pro;
    color: #212121;
  }

  .dc-chart .selected path,
  .dc-chart .selected circle {
    stroke-width: 0;
  }

  ${d3Tip}
`
