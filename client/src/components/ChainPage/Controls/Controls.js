import 'rc-slider/assets/index.css'
import React, { Fragment, useContext, useEffect, useRef, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { changeRange } from '../../../context/range/actions'
import { changeCurrentSection } from '../../../context/current-section/actions'
import { store } from '../../../context/store'
import { constants } from '../../../utils'
import { Block } from '../../shared/Block'
import { Checkbox } from '../../shared/Checkbox'
import { DatePicker } from '../../shared/DatePicker'
import { Input } from '../../shared/Input'
import { Controls, DashedLine, Title } from './controls.styled'
import { RangeInputs } from './RangeInputs'

const nodeLabelOptions = [
  { value: 'heightLabel', label: 'show height' },
  { value: 'parentWeightLabel', label: 'show parent weight' },
  // { value: 'weight', label: 'weight contributed by the block' },
  { value: 'disableMinerColor', label: 'disable miner color' },
  { value: 'disableTipsetColor', label: 'disable tipset color' },
]

const ControlsComponent = ({
  debouncedUpdateBlockHeightFilter,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  setMiner,
  maxBlock,
}) => {
  const { state, dispatch } = useContext(store)
  const { range } = state
  const controlsRef = useRef()

  useEffect(() => {
    if (maxBlock !== range[0]) {
      changeRange(dispatch, range, [Math.max(0, maxBlock - constants.initialBlockRangeLimit), maxBlock])
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxBlock])

  const changeNodeLabel = (event) => {
    const { value, checked } = event.target
    dispatch({ type: 'CHANGE_NODE_CHECKBOX', payload: { key: value, value: checked } })
  }

  const options = nodeLabelOptions.map((item, i) => (
    <Fragment key={item.value}>
      <Checkbox checked={state.nodeCheckbox[item.value]} onChange={changeNodeLabel} value={item.value}>
        {item.label}
      </Checkbox>
      {i < nodeLabelOptions.length - 1 && <DashedLine />}
    </Fragment>
  ))

  const onChangeRangeInput = (newInternalBlockRange) => {
    const newRange = changeRange(dispatch, range, newInternalBlockRange)

    debouncedUpdateBlockHeightFilter(newRange)
  }

  return (
    <Controls ref={controlsRef} id="controls">
      <Block>
        <Title>Block Height</Title>
        <DashedLine />
        <RangeInputs rangeIntervals={range} onChange={onChangeRangeInput} />
        <DashedLine />
        {options}
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
    </Controls>
  )
}

export { ControlsComponent as Controls }
