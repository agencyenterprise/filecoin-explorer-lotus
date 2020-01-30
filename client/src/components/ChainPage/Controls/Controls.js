import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import React, { useEffect, useState, Fragment } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { constants } from '../../../utils'
import { Block } from '../../shared/Block'
import { DatePicker } from '../../shared/DatePicker'
import { Input } from '../../shared/Input'
import { Checkbox } from '../../shared/Checkbox'
import { Controls, DashedLine, Description, Heading, Title } from './controls.styled'

const Range = Slider.createSliderWithTooltip(Slider.Range)

const nodeLabelOptions = [
  { value: 'heightLabel', label: 'height' },
  { value: 'parentWeightLabel', label: 'parent weight' },
  { value: 'weight', label: 'weight contributed by the block' },
]

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
  const [internalRange, setInternalRange] = useState([Math.max(0, maxBlock - constants.maxBlockRange), maxBlock])
  const [checkbox, changeCheckbox] = useState({})

  useEffect(() => {
    if (maxBlock !== internalRange[0]) {
      setInternalRange([Math.max(0, maxBlock - constants.maxBlockRange), maxBlock])
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxBlock])

  const changeNodeLabel = (event) => {
    changeCheckbox({ ...checkbox, [event.target.value]: event.target.checked })
  }

  const options = nodeLabelOptions.map((item, i) => (
    <Fragment key={item.value}>
      <Checkbox checked={checkbox[item.value]} onChange={changeNodeLabel} value={item.value}>
        Show {item.label}
      </Checkbox>
      {i < nodeLabelOptions.length - 1 && <DashedLine />}
    </Fragment>
  ))

  return (
    <Controls>
      <Block>
        <Heading>Filecoin Block Explorer</Heading>
      </Block>
      <Block>
        <Title>Block Height</Title>
        <DashedLine />
        <DashedLine />
        {internalRange[1] && (
          <Range
            min={minBlock}
            max={maxBlock}
            value={internalRange}
            step={5}
            allowCross={false}
            onChange={(newInternalBlockRange) => {
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

              setInternalRange(newInternalBlockRange)
            }}
            onAfterChange={debouncedUpdateBlockHeightFilter}
          />
        )}
        <Description>
          The slider has a max range of 50 blocks due to lorem ipsum dolor amet pitchfork raw denim thundercats butcher
          flexitarian.
        </Description>
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
      <Block>{options}</Block>
      <Block>
        <Title>Time block received after parent</Title>
      </Block>
    </Controls>
  )
}

export { ControlsComponent as Controls }
