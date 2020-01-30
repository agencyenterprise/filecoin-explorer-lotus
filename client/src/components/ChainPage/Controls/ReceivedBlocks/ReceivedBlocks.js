import React from 'react'

import {
  ReceivedBlocks,
  Amount,
  Number,
  Blocks,
  Data,
  ProgressBar,
  Description,
  Kind,
  Percentage,
} from './received-blocks.styled'
const ReceivedBlocksComponent = ({ amount, kind, percentage }) => {
  return (
    <ReceivedBlocks>
      <Amount>
        <Number>{amount}</Number>
        <Blocks>Blocks</Blocks>
      </Amount>
      <Data>
        <ProgressBar percentage={percentage || 0} />
        <Description>
          <Kind>{kind}</Kind>
          <Percentage>{percentage} %</Percentage>
        </Description>
      </Data>
    </ReceivedBlocks>
  )
}

export { ReceivedBlocksComponent as ReceivedBlocks }
