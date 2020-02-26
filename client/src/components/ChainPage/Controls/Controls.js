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
import { Miners } from './Miners'
import { Orphans } from './Orphans'
import { RangeInputs } from './RangeInputs'
import { ReceivedBlocks } from './ReceivedBlocks'

const nodeLabelOptions = [
  { value: 'showHeightRuler', label: 'Block height ruler' },
  // { value: 'showParentWeight', label: 'Show parent weight', disabled: true },
  // { value: 'disableMinerColor', label: 'Disable miner color', disabled: true },
  // { value: 'disableTipsetColor', label: 'Disable tipset color', disabled: true },
]

const ControlsComponent = ({ maxBlock }) => {
  const {
    state: { chain, filter, range },
    dispatch,
  } = useContext(store)

  const debouncedBlockRangeChange = debounce((blockRange) => {
    changeFilter('blockRange', blockRange)
  }, 500)

  useEffect(() => {
    if (maxBlock !== range[0]) {
      changeRange(dispatch, range, [Math.max(0, maxBlock - constants.initialBlockRangeLimit), maxBlock])
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxBlock])

  const options = nodeLabelOptions.map((item, i) => (
    <Fragment key={item.value}>
      <FilterItem
        label={item.label}
        value={item.value}
        checked={filter[item.value]}
        disabled={item.disabled}
        onChange={(e) => changeFilter(item.value, e.target.checked)}
      />
      {i < nodeLabelOptions.length - 1 && <DashedLine />}
    </Fragment>
  ))

  const onChangeRangeInput = (newInternalBlockRange) => {
    const newRange = changeRange(dispatch, range, newInternalBlockRange)

    debouncedBlockRangeChange(newRange)
  }

  const changeFilter = (key, value) => {
    const allEmpty = !filter[key] && !value
    const notChanged = filter[key] === value

    if (allEmpty || notChanged) return

    changeFilterAction(dispatch, { key, value })
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
        <Title>Narrow date range</Title>
        <DatePicker
          selected={filter.startDate}
          onChange={(date) => changeFilter('startDate', date)}
          placeholderText="Start date, mm/dd/yyyy"
        />
        <DatePicker
          selected={filter.endDate}
          onChange={(date) => changeFilter('endDate', date)}
          placeholderText="End date, mm/dd/yyyy"
        />
      </Block>
      <Block>
        <Title>Find by Miner</Title>
        <Input
          placeholder="Miner Address"
          onBlur={(e) => window.dispatchEvent(new CustomEvent('select-miners', { detail: e.target.value }))}
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
            window.dispatchEvent(new CustomEvent('select-node', { detail: e.target.value }))
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.target.blur()
            }
          }}
        />
      </Block>

      <Block>
        <Title>Time block received after parent</Title>
        <ReceivedBlocks
          amount={chain.timeToReceive.under48.total}
          percentage={chain.timeToReceive.under48.percentage}
          kind="less than 48s"
        />
        <ReceivedBlocks
          amount={chain.timeToReceive.between48and51.total}
          percentage={chain.timeToReceive.between48and51.percentage}
          kind="between 48 - 51s"
        />
        <ReceivedBlocks
          amount={chain.timeToReceive.between51and60.total}
          percentage={chain.timeToReceive.between51and60.percentage}
          kind="between 51 - 60s"
        />
        <ReceivedBlocks
          amount={chain.timeToReceive.above60.total}
          percentage={chain.timeToReceive.above60.percentage}
          kind="more than 60s"
        />
      </Block>
      <Block>
        <Title>Orphans</Title>
        <Orphans total={chain.total} orphans={chain.orphans.length} />
      </Block>
      <Block>
        <Title>
          Miner distribution {filter.blockRange[0]} - {filter.blockRange[1]}
        </Title>
        <Miners />
      </Block>
    </Controls>
  )
}

export { ControlsComponent as Controls }
