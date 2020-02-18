import debounce from 'lodash/debounce'
import React, { useContext, useEffect } from 'react'
import { getBlockRange } from '../../api'
import { changeFilter as changeFilterAction } from '../../context/filter/actions'
import { store } from '../../context/store'
import { constants } from '../../utils'
import { ChainPage, ChartAndRange, RangeContainer } from './chain-page.styled'
import { Controls } from './Controls'
import { LaGrapha } from './LaGrapha'
import { Range } from './Range'

const ChainPageComponent = () => {
  const { state, dispatch } = useContext(store)
  const { startDate, endDate, blockRange, miner, minBlock, maxBlock } = state.filter

  const changeFilter = (payload) => {
    changeFilterAction(dispatch, payload)
  }

  useEffect(() => {
    const fetchBlockRange = async () => {
      const res = await getBlockRange()

      if (res && res.minHeight) {
        if (res.minHeight) {
          changeFilter({ key: 'minBlock', value: Number(res.minHeight) })
        }

        if (res.maxHeight) {
          const _maxBlock = Number(res.maxHeight)

          changeFilter({ key: 'maxBlock', value: _maxBlock })
          changeFilter({
            key: 'blockRange',
            value: [Math.max(0, _maxBlock - constants.initialBlockRangeLimit), _maxBlock],
          })
        }
      }
    }

    fetchBlockRange()
  }, [])

  return (
    <ChainPage id="main">
      <ChartAndRange>
        <LaGrapha blockRange={blockRange} maxBlock={maxBlock} startDate={startDate} endDate={endDate} miner={miner} />
        <RangeContainer>
          <Range minBlock={minBlock} maxBlock={maxBlock} />
        </RangeContainer>
      </ChartAndRange>
      <Controls maxBlock={maxBlock} />
    </ChainPage>
  )
}

export { ChainPageComponent as ChainPage }
