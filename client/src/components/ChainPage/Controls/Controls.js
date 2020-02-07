import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import React, { Fragment, useContext, useEffect, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { store } from '../../../context/store'
import { constants } from '../../../utils'
import { Block } from '../../shared/Block'
import { Checkbox } from '../../shared/Checkbox'
import { DatePicker } from '../../shared/DatePicker'
import { Input } from '../../shared/Input'
import { Controls, DashedLine, Description, Heading, Title } from './controls.styled'
import { ReceivedBlocks } from './ReceivedBlocks'
import { RangeInputs } from './RangeInputs'

const Range = Slider.createSliderWithTooltip(Slider.Range)

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
  minBlock,
  maxBlock,
}) => {
  const [internalRange, setInternalRange] = useState([0, 0])
  const { state, dispatch } = useContext(store)

  useEffect(() => {
    if (maxBlock !== internalRange[0]) {
      setInternalRange([Math.max(0, maxBlock - constants.initialBlockRangeLimit), maxBlock])
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxBlock])

  const changeNodeLabel = (event) => {
    const { value, checked } = event.target
    dispatch({ type: 'CHANGE_NODE_CHECKBOX', payload: { key: value, value: checked } })

    setTimeout(() => {
      window.selectionDiagram.redraw()
    }, 100)
  }

  const options = nodeLabelOptions.map((item, i) => (
    <Fragment key={item.value}>
      <Checkbox checked={state.nodeCheckbox[item.value]} onChange={changeNodeLabel} value={item.value}>
        {item.label}
      </Checkbox>
      {i < nodeLabelOptions.length - 1 && <DashedLine />}
    </Fragment>
  ))

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

  const onChanRangeInput = (newInternalBlockRange) => {
    const resolvedRangeInterval = resolveRangeInterval(newInternalBlockRange)

    setInternalRange(resolvedRangeInterval)
    debouncedUpdateBlockHeightFilter(resolvedRangeInterval)
  }

  return (
    <Controls>
      <Block dark>
        <Heading>Filecoin Block Explorer</Heading>
      </Block>
      <Block>
        <Title>Block Height</Title>
        <DashedLine />
        <RangeInputs rangeIntervals={internalRange} onChange={onChanRangeInput} />
        <DashedLine />
        {internalRange[1] && (
          <Range
            min={minBlock}
            max={maxBlock}
            value={internalRange}
            step={5}
            allowCross={false}
            onChange={onChangeRange}
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
        <Title>Filters</Title>
        <div id="minerPie" />
        {/* <div id="blockHeightPie" /> */}
        <div id="orphanPie" />
        <div id="weirdTimeBar" />
      </Block>
      <Block>
        <Title>Time block received after parent</Title>
        <ReceivedBlocks amount={562} kind="less than 48s" percentage={97.4} />
        <ReceivedBlocks amount={12} kind="between 48 - 51s" percentage={2.1} />
      </Block>
    </Controls>
  )
}

export { ControlsComponent as Controls }
