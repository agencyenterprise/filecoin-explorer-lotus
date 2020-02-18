import debounce from 'lodash/debounce'
import React, { Fragment, useContext, useEffect } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { changeFilter as changeFilterAction } from '../../../context/filter/actions'
import { changeRange } from '../../../context/range/actions'
import { store } from '../../../context/store'
import { constants } from '../../../utils'
import { Block } from '../../shared/Block'
import { DatePicker } from '../../shared/DatePicker'
import { Input } from '../../shared/Input'
import { Controls, DashedLine, Title } from './controls.styled'
import { FilterItem } from './FilterItem'
import { RangeInputs } from './RangeInputs'

const nodeLabelOptions = [
  { value: 'heightLabel', label: 'show height' },
  { value: 'parentWeightLabel', label: 'show parent weight' },
  { value: 'disableMinerColor', label: 'disable miner color' },
  { value: 'disableTipsetColor', label: 'disable tipset color' },
]

const ControlsComponent = ({ maxBlock }) => {
  const {
    state: { filter, range },
    dispatch,
  } = useContext(store)

  const debouncedBlockRangeChange = debounce((blockRange) => {
    changeFilter({ key: 'blockRange', value: blockRange })
  }, 500)

  useEffect(() => {
    if (maxBlock !== range[0]) {
      changeRange(dispatch, range, [Math.max(0, maxBlock - constants.initialBlockRangeLimit), maxBlock])
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxBlock])

  const changeFilter = (payload) => {
    changeFilterAction(dispatch, payload)
  }

  const options = nodeLabelOptions.map((item, i) => (
    <Fragment key={item.value}>
      <FilterItem
        label={item.label}
        value={item.value}
        checked={filter[item.value]}
        onChange={(e) => changeFilter({ key: item.value, value: e.target.checked })}
      />
      {i < nodeLabelOptions.length - 1 && <DashedLine />}
    </Fragment>
  ))

  const onChangeRangeInput = (newInternalBlockRange) => {
    const newRange = changeRange(dispatch, range, newInternalBlockRange)

    debouncedBlockRangeChange(newRange)
  }

  return (
    <Controls id="controls">
      <Block>
        <Title>Block Height</Title>
        <DashedLine />
        <RangeInputs rangeIntervals={range} onChange={onChangeRangeInput} />
        <DashedLine />
        {options}
      </Block>
      <Block>
        <Title>Find by Miner</Title>
        <Input
          placeholder="Miner Address"
          onBlur={(e) => {
            changeFilter({ key: 'miner', value: e.target.value })
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.target.blur()
            }
          }}
        />
      </Block>
      <Block>
        <Title>Find by Cid</Title>
        <Input
          placeholder="Enter block CID"
          onBlur={(e) => {
            changeFilter({ key: 'cid', value: e.target.value })
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
          selected={filter.startDate}
          onChange={(date) => changeFilter({ key: 'startDate', value: date })}
          placeholderText="Start date, mm/dd/yyyy"
        />
        <DatePicker
          selected={filter.endDate}
          onChange={(date) => changeFilter({ key: 'endDate', value: date })}
          placeholderText="End date, mm/dd/yyyy"
        />
      </Block>
    </Controls>
  )
}

export { ControlsComponent as Controls }
