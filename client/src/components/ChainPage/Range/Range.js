import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import React, { useEffect, useState } from 'react'
import { RangeContainer } from './range.styled'
import { constants } from '../../../utils'

const Range = Slider.createSliderWithTooltip(Slider.Range)

const RangeComponent = ({ minBlock, maxBlock, debouncedUpdateBlockHeightFilter }) => {
  const [internalRange, setInternalRange] = useState([0, 0])

  useEffect(() => {
    if (maxBlock !== internalRange[0]) {
      setInternalRange([Math.max(0, maxBlock - constants.initialBlockRangeLimit), maxBlock])
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxBlock])

  const resolveRangeInterval = (newInternalBlockRange) => {
    if (newInternalBlockRange[0] > newInternalBlockRange[1]) {
      let tmp = newInternalBlockRange[1]

      newInternalBlockRange[1] = newInternalBlockRange[0]
      newInternalBlockRange[0] = tmp
    }

    if (internalRange[0] !== newInternalBlockRange[0]) {
      // note: min is moving
      if (newInternalBlockRange[1] - newInternalBlockRange[0] > constants.maxBlockRange) {
        newInternalBlockRange[1] = newInternalBlockRange[0] + constants.maxBlockRange
      }
    } else {
      // note: max is moving
      if (newInternalBlockRange[1] - newInternalBlockRange[0] > constants.maxBlockRange) {
        newInternalBlockRange[0] = newInternalBlockRange[1] - constants.maxBlockRange
      }
    }

    if (newInternalBlockRange[1] === 0) {
      newInternalBlockRange[0] = 0
      newInternalBlockRange[1] = constants.maxBlockRange
    }

    return newInternalBlockRange
  }

  const onChangeRange = (newInternalBlockRange) => {
    const resolvedRangeInterval = resolveRangeInterval(newInternalBlockRange)

    setInternalRange(resolvedRangeInterval)
  }

  return (
    <RangeContainer>
      {(internalRange[1] && (
        <Range
          min={minBlock}
          max={maxBlock}
          value={internalRange}
          step={5}
          allowCross={false}
          onChange={onChangeRange}
          onAfterChange={debouncedUpdateBlockHeightFilter}
        />
      )) || <div />}
    </RangeContainer>
  )
}

export { RangeComponent as Range }
