import { getChainData } from '../../api'
import { orderBy, findIndex } from 'lodash'

const isWeirdTime = (timeToReceive) => {
  if (!timeToReceive) return 0
  if (timeToReceive <= 48) return 1
  if (timeToReceive <= 51) return 2
  if (timeToReceive <= 60) return 3
  return 4
}

const tipsetKeyFormatter = (block) => {
  return `${block.parentstateroot}-${block.height}`
}

const calcX = (block, blocksAtHeight) => {
  const blocksAtCurrentHeight = blocksAtHeight[block.height]
  const centerBlock = (blocksAtCurrentHeight.length - 1) / 2
  const positionOfCurrentBlock = findIndex(blocksAtCurrentHeight, { block: block.block, filler: false })
  let xPos = (positionOfCurrentBlock - centerBlock) / blocksAtCurrentHeight.length / 2

  return xPos
}

const createBlock = (block, blockParentInfo, tipsets, miners, blocksAtHeight) => {
  const blockId = block.block
  const timeToReceive = parseInt(block.syncedtimestamp) - parseInt(block.parenttimestamp)
  const tipsetKey = tipsetKeyFormatter(block)
  return {
    id: blockId,
    key: blockId,
    height: block.height,
    group: tipsets[tipsetKey],
    label: block.miner,
    miner: block.miner,
    minerColor: miners[block.miner],
    parentWeight: block.parentweight,
    timeToReceive: `${timeToReceive}s`,
    weirdTime: isWeirdTime(timeToReceive),
    blockCid: blockId,
    minerPower: blockParentInfo[blockId] && blockParentInfo[blockId].power,
    weight: block.weight,
    tipset: tipsets[tipsetKey],
    x: calcX(block, blocksAtHeight),
    y: block.height,
  }
}

const createEdge = (block, isBlockOrphan, timeToReceive, blockIndices) => {
  const blockId = block.block
  return {
    from: blockIndices[blockId],
    to: blockIndices[block.parent],
    key: `${blockId}-${block.parent}-e`,
    time: timeToReceive,
    edgeWeirdTime: isWeirdTime(timeToReceive),
    isOrphan: isBlockOrphan,
  }
}

const blocksToChain = (blocksArr, bhRangeEnd, bhRangeStart) => {
  // format chain as expected by dc.graph.js
  const chain = {
    nodes: [],
    edges: [],
  }

  // used to store info for data transformations necessary to parse query data to right format
  const blocks = {}
  const blockParentInfo = {}
  const blockIndices = {}
  const tipsets = {}
  const miners = {}
  const blocksAtHeight = {}
  const minerCount = {}

  blocksArr.forEach((block, index) => {
    blockParentInfo[block.parent] = { power: block.parentpower }
    const tipsetKey = tipsetKeyFormatter(block)

    minerCount[block.miner] = minerCount[block.miner] ? minerCount[block.miner] + 1 : 1

    if (!tipsets[tipsetKey]) {
      tipsets[tipsetKey] = index
    }
    if (!miners[block.miner]) {
      miners[block.miner] = index
    }

    const blockInfoForHeight = { block: block.block, tipsetGroup: tipsets[tipsetKey], index: index, filler: false }
    if (!blocksAtHeight[block.height]) {
      blocksAtHeight[block.height] = [blockInfoForHeight]
    } else if (findIndex(blocksAtHeight[block.height], { tipsetGroup: tipsets[tipsetKey] }) === -1) {
      // if new tipset insert blank before to space
      blocksAtHeight[block.height].push({ ...blockInfoForHeight, filler: true })
      blocksAtHeight[block.height].push(blockInfoForHeight)
      blocksAtHeight[block.height] = orderBy(blocksAtHeight[block.height], ['tipsetGroup', 'filler'], ['asc', 'desc'])
    } else if (findIndex(blocksAtHeight[block.height], { block: block.block }) === -1) {
      // @todo: improve performance by finding better place to insert and using splice and maintain sorted array
      blocksAtHeight[block.height].push(blockInfoForHeight)
      blocksAtHeight[block.height] = orderBy(blocksAtHeight[block.height], ['tipsetGroup', 'filler'], ['asc', 'desc'])
    }
  })

  blocksArr.forEach((block, index) => {
    const blockId = block.block

    // @todo: check if should be comparing parent timestamp or parent synced timestamp
    const timeToReceive = parseInt(block.syncedtimestamp) - parseInt(block.parenttimestamp)
    // block.block may appear multiple times because there are many parent child relationships
    // we want to only add the node once but add all the edges to represent the different parent/child relationships
    if (!blocks[blockId]) {
      const chainLength = chain.nodes.push(createBlock(block, blockParentInfo, tipsets, miners, blocksAtHeight))
      blockIndices[blockId] = chainLength - 1
      blocks[blockId] = index
    }

    const isDirectParent = Number(block.parentheight) === Number(block.height) - 1

    const isOrphan = (block) => {
      return blockParentInfo[block.block] && bhRangeEnd !== block.height ? 0 : 1
    }

    if (isDirectParent && blockIndices[blockId] && blockIndices[block.parent]) {
      const newEdge = createEdge(block, isOrphan(block), timeToReceive, blockIndices)
      chain.edges.push(newEdge)
    }
  })

  // push fake nodes so that chain renders in only half the available width for easier zooomoing
  chain.nodes.push({ y: 0, x: -1 }, { y: 0, x: 1 })
  chain.miners = minerCount

  return chain
}

export const getChain = async ({ blockRange, startDate, endDate, miner, cid }) => {
  const blocksArr = await getChainData({
    blockRange: [blockRange[0], blockRange[1]],
    startDate,
    endDate,
    miner,
    cid,
  })

  const chain = blocksToChain(blocksArr, blockRange[1], blockRange[0])
  const miners = mapMiners(chain)

  return {
    ...chain,
    miners,
  }
}

const toDecimal = (n) => Math.round(n * 100) / 100
const palette = ['#3ED2DC', '#DB5669', '#F5BBBA', '#FDC963', '#FE7763', '#27346A', '#E58E7B', '#2D5942']

const mapMiners = (chain) => {
  const total = Object.values(chain.miners).reduce((total, current) => total + current, 0)

  const mMiners = Object.keys(chain.miners).map((key) => {
    const value = chain.miners[key]

    return {
      name: key,
      total: value,
      percentage: toDecimal((100 * value) / total),
    }
  })

  const sortedMiners = mMiners.sort((a, b) => b.total - a.total)

  let paletteIndex = 0
  const minersWithColor = sortedMiners.map((miner) => {
    if (paletteIndex >= palette.length) paletteIndex = 0

    return {
      ...miner,
      color: palette[paletteIndex++],
    }
  })

  return minersWithColor
}
