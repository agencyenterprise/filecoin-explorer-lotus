import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import React, { useContext, useEffect } from 'react'
import { changeRange } from '../../../context/range/actions'
import { store } from '../../../context/store'
import { constants } from '../../../utils'
import { RangeContainer, RangeNumber } from './range.styled'

const Range = Slider.createSliderWithTooltip(Slider.Range)

const RangeComponent = ({ minBlock, maxBlock, debouncedUpdateBlockHeightFilter }) => {
  const { state, dispatch } = useContext(store)
  const { range } = state

  useEffect(() => {
    if (maxBlock !== range[0]) {
      changeRange(dispatch, range, [Math.max(0, maxBlock - constants.initialBlockRangeLimit), maxBlock])
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxBlock])

  const onChangeRange = (newInternalBlockRange) => {
    changeRange(dispatch, range, newInternalBlockRange)
  }

  return (
    <RangeContainer>
      <RangeNumber>{range[0]}</RangeNumber>
      {(range[1] && (
        <Range
          min={minBlock}
          max={maxBlock}
          value={range}
          step={5}
          allowCross={false}
          onChange={onChangeRange}
          onAfterChange={debouncedUpdateBlockHeightFilter}
        />
      )) || <div />}
      <RangeNumber>{range[1]}</RangeNumber>
    </RangeContainer>
  )
}

export { RangeComponent as Range }
