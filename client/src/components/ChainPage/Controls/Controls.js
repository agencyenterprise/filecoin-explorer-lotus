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
  const { range, currentSection } = state
  const [sections, setSections] = useState([])
  const controlsRef = useRef()

  const onScroll = () => {
    const controlsElement = controlsRef.current

    const topPos = controlsElement.scrollTop

    if (controlsElement.scrollHeight == controlsElement.scrollTop + window.innerHeight) {
      changeCurrentSection(dispatch, sections.length)

      return
    }

    let selectedSection = 1

    for (let i = 0; i < sections.length; i += 1) {
      const section = sections[i]

      if (topPos >= section.top) {
        selectedSection = section.section

        break
      }
    }

    if (selectedSection !== currentSection) {
      changeCurrentSection(dispatch, selectedSection)
    }
  }

  useEffect(() => {
    const controlsElement = controlsRef.current
    controlsElement.addEventListener('scroll', onScroll)

    return () => {
      controlsElement.removeEventListener('scroll', onScroll)
    }
  }, [sections, currentSection])

  useEffect(() => {
    const elements = document.querySelectorAll('[data-section]')

    const asItems = []

    elements.forEach((element) => {
      asItems.push({
        top: element.offsetTop,
        section: Number(element.getAttribute('data-section')),
      })
    })

    asItems.reverse()

    setSections(asItems)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (maxBlock !== range[0]) {
      changeRange(dispatch, range, [Math.max(0, maxBlock - constants.initialBlockRangeLimit), maxBlock])
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

  const onChangeRangeInput = (newInternalBlockRange) => {
    const newRange = changeRange(dispatch, range, newInternalBlockRange)

    debouncedUpdateBlockHeightFilter(newRange)
  }

  return (
    <Controls ref={controlsRef} id="controls">
      <Block data-section={1} data-label="Block Height">
        <Title>1. Block Height</Title>
        <DashedLine />
        <RangeInputs rangeIntervals={range} onChange={onChangeRangeInput} />
        <DashedLine />
        {options}
      </Block>
      <Block data-section={2} data-label="Find Miner">
        <Title>2. Find Miner</Title>
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
      <Block data-section={3} data-label="Narrow date range">
        <Title>3. Narrow date range</Title>
        <DatePicker
          selected={startDate}
          onChange={setStartDate}
          placeholderText="Start date, mm/dd/yyyy"
          style={{ width: '100%' }}
        />
        <DatePicker selected={endDate} onChange={setEndDate} placeholderText="End date, mm/dd/yyyy" />
      </Block>
      {/* <Block data-section={4} data-label="Filters">
        <Title>4. Filters</Title>
        <div id="minerPie" />
        {/* <div id="blockHeightPie" /> */}
      {/* <div id="orphanPie" />
        <div id="weirdTimeBar" /> */}
      {/* </Block> */}
      {/* <Block>
        <Title>5. Time block received after parent</Title>
        <ReceivedBlocks amount={562} kind="less than 48s" percentage={97.4} />
        <ReceivedBlocks amount={12} kind="between 48 - 51s" percentage={2.1} />
      </Block> */}
    </Controls>
  )
}

export { ControlsComponent as Controls }
