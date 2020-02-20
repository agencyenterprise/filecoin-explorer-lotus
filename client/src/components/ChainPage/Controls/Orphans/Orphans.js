import React from 'react'
import { Box, ColorLegend, Description, InnerCircle, Orphans, OuterCircle } from './orphans.styled'

const OrphansComponent = ({ total, orphans }) => {
  const outerCircleDiameter = 210
  const innerCiclePercentage = (100 * orphans) / total / 100

  let innerCicleDiameter = innerCiclePercentage * outerCircleDiameter

  if (!innerCicleDiameter || innerCicleDiameter < 20) {
    innerCicleDiameter = 20
  }

  return (
    <Orphans>
      <Box>
        <OuterCircle>
          <InnerCircle size={innerCicleDiameter} />
        </OuterCircle>
      </Box>
      <Box>
        <ColorLegend color="#27346a" />
        <Description>Total</Description>
        {total}
      </Box>
      <Box>
        <ColorLegend color="#db5669" />
        <Description>Orphans</Description>
        {orphans}
      </Box>
    </Orphans>
  )
}

export { OrphansComponent as Orphans }
