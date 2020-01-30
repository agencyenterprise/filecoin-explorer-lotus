import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import React, { useEffect, useState } from 'react'

import 'react-datepicker/dist/react-datepicker.css'
import { constants } from '../../../utils'
import { Block } from '../../shared/Block'
import { Input } from '../../shared/Input'
import { DatePicker } from '../../shared/DatePicker'

import { Controls, Heading, Title } from './controls.styled'

const Range = Slider.createSliderWithTooltip(Slider.Range)

const ControlsComponent = ({
  debouncedUpdateBlockHeightFilter,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  setMiner,
  minBlock,
  maxBlock,
}) => {
  const [internalBlockRange, setInternalBlockRange] = useState([])

  useEffect(() => {
    setInternalBlockRange([Math.max(0, maxBlock - constants.maxBlockRange), maxBlock])
  }, [maxBlock])

  return (
    <Controls>
      <Block>
        <Heading>Filecoin Block Explorer</Heading>
      </Block>
      <Block>
        <Title>Block Height</Title>
        <Range
          min={minBlock}
          max={maxBlock}
          value={internalBlockRange}
          step={5}
          allowCross={false}
          onChange={(newInternalBlockRange) => {
            if (internalBlockRange[0] !== newInternalBlockRange[0]) {
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

            setInternalBlockRange(newInternalBlockRange)
          }}
          onAfterChange={debouncedUpdateBlockHeightFilter}
        />
      </Block>
      <Block>
        <Title>Find Miner</Title>
        <Input
          placeholder="Miner Address"
          onBlur={(e) => {
            setMiner(e.target.value)
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.target.blur()
            }
          }}
        />
      </Block>
      <Block>
        <Title>Narrow date range</Title>
        <DatePicker
          selected={startDate}
          onChange={setStartDate}
          placeholderText="Start date, mm/dd/yyyy"
          style={{ width: '100%' }}
        />
        <DatePicker selected={endDate} onChange={setEndDate} placeholderText="End date, mm/dd/yyyy" />
      </Block>
      <Block>
        <Title>Time block received after parent</Title>
      </Block>
    </Controls>
  )
}

export { ControlsComponent as Controls }
