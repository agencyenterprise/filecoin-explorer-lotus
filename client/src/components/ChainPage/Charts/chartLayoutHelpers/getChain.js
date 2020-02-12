import { getChainData } from '../../../../api'
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
  console.log(block.height, blocksAtCurrentHeight, centerBlock)
  const positionOfCurrentBlock = findIndex(blocksAtCurrentHeight, { block: block.block, filler: false })
  // @todo update so there is more space between unlike tipsets
  let xPos = positionOfCurrentBlock - centerBlock
  // console.log('x pos is', xPos, centerBlock, positionOfCurrentBlock, blocksAtCurrentHeight)
  // if (positionOfCurrentBlock % 2) {
  //   xPos *= -1
  // }
  return xPos
}

const createBlock = (block, blockParentInfo, tipsets, blocksAtHeight) => {
  const blockId = block.block
  const timeToReceive = parseInt(block.syncedtimestamp) - parseInt(block.parenttimestamp)
  const tipsetKey = tipsetKeyFormatter(block)
  return {
    id: blockId,
    key: blockId,
    height: block.height,
    group: tipsets[tipsetKey],
    label: block.height,
    miner: block.miner,
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

const createEmptyEdges = (block, isBlockOrphan, blocks) => {
  const blockId = block.block
  const edgesToBeAdded = []

  edgesToBeAdded.push({
    from: `${blockId}-empty`,
    to: block.parent,
    key: `${blockId}-${block.parent}-eb`,
    edgeWeirdTime: isWeirdTime(),
    time: 0,
    isOrphan: 0,
  })

  edgesToBeAdded.push({
    from: blockId,
    to: `${blockId}-empty`,
    key: `${blockId}-${block.parent}-ep`,
    edgeWeirdTime: isWeirdTime(),
    time: 0,
    isOrphan: isBlockOrphan,
  })

  return edgesToBeAdded
}

const blocksToChain = (blocksArr, bhRangeEnd, bhRangeStart) => {
  // format chain as expected by dc.graph.js
  const chain = {
    nodes: [],
    edges: [],
  }

  const heightRange = bhRangeEnd - bhRangeStart

  // used to store info for data transformations necessary to parse query data to right format
  const blocks = {}
  const blockParentInfo = {}
  const blockIndices = {}
  const tipsets = {}
  const blocksAtHeight = {}

  blocksArr.forEach((block, index) => {
    blockParentInfo[block.parent] = { power: block.parentpower }
    const tipsetKey = tipsetKeyFormatter(block)

    if (!tipsets[tipsetKey]) {
      tipsets[tipsetKey] = index
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
      const chainLength = chain.nodes.push(createBlock(block, blockParentInfo, tipsets, blocksAtHeight))
      blockIndices[blockId] = chainLength - 1
      blocks[blockId] = index
    }

    const isDirectParent = Number(block.parentheight) === Number(block.height) - 1

    const isOrphan = (block) => {
      return blockParentInfo[block.block] && bhRangeEnd !== block.height ? 0 : 1
    }

    const createEmptyBlock = (block) => ({
      key: `${block.block}-empty`,
      height: null,
      miner: '0',
      parentWeight: block.parentweight,
      weirdTime: isWeirdTime(),
      tipset: 1,
      x: 0,
      y: 0,
    })

    if (isDirectParent && blockIndices[blockId] && blockIndices[block.parent]) {
      const newEdge = createEdge(block, isOrphan(block), timeToReceive, blockIndices)
      chain.edges.push(newEdge)
    }
    // @todo: need to add back this feature of adding empty nodes when skip parent
    // else if (!blocks[blockId]) {
    //   const newEmptyBlock = createEmptyBlock(block)
    //   const newEmptyEdges = createEmptyEdges(block, isOrphan(block), blocks)

    //   chain.nodes.push(newEmptyBlock)
    //   chain.edges.push(...newEmptyEdges)
    // }
  })

  return chain
}

export const getChain = async (blockRange, startDate, endDate, miner) => {
  const blocksArr = await getChainData({
    blockRange: [blockRange[0], blockRange[1]],
    startDate,
    endDate,
    miner,
  })

  return blocksToChain(blocksArr, blockRange[1], blockRange[0])
}

export const fetchMore = async (blockRange, maxBlock, startDate, endDate, miner, chain, paging, inverse) => {
  let from = blockRange[0] - 10 * paging.bottom
  let to = blockRange[0] - 10 * (paging.bottom - 1)

  if (inverse) {
    from = blockRange[1] + 10 * (paging.top - 1)
    to = blockRange[1] + 10 * paging.top
  }

  if (from < 0) {
    from = 0
  }

  if (to > maxBlock) {
    to = maxBlock
  }

  if (from === to) {
    return chain
  }

  const blocksArr = await getChainData({
    blockRange: [from, to],
    startDate,
    endDate,
    miner,
  })

  const chainToAppend = blocksToChain(blocksArr, blockRange[1])

  const newChain = {
    nodes: [...chainToAppend.nodes, ...chain.nodes],
    edges: [...chainToAppend.edges, ...chain.edges],
  }

  return newChain
}
