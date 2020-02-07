import debounce from 'lodash/debounce'
import React, { useEffect, useState } from 'react'
import { getBlockRange } from '../../api'
import { constants } from '../../utils'
import { ChainPage } from './chain-page.styled'
import { Charts } from './Charts'
import { Controls } from './Controls'

const ChainPageComponent = () => {
  const [blockRange, setBlockRange] = useState([])
  const [minBlock, setMinBlock] = useState(0)
  const [maxBlock, setMaxBlock] = useState(0)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [miner, setMiner] = useState('')

  useEffect(() => {
    const fetchBlockRange = async () => {
      const res = await getBlockRange()

      if (res && res.minHeight) {
        if (res.minHeight) {
          setMinBlock(Number(res.minHeight))
        }

        if (res.maxHeight) {
          const _maxBlock = Number(res.maxHeight)

          setMaxBlock(_maxBlock)
          setBlockRange([Math.max(0, _maxBlock - constants.initialBlockRangeLimit), _maxBlock])
        }
      }
    }

    fetchBlockRange()
  }, [])

  return (
    <ChainPage id="main">
      <Charts blockRange={blockRange} startDate={startDate} endDate={endDate} miner={miner} />
      <Controls
        minBlock={minBlock}
        maxBlock={maxBlock}
        debouncedUpdateBlockHeightFilter={debounce((blockRange) => {
          setBlockRange(blockRange)
        }, 500)}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        setMiner={setMiner}
      />
    </ChainPage>
  )
}

export { ChainPageComponent as ChainPage }
