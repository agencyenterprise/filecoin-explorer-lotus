import { getChainData } from '../../../../api'

const isWeirdTime = (timeToReceive) => {
  if (!timeToReceive) return 0
  if (timeToReceive <= 48) return 1
  if (timeToReceive <= 51) return 2
  if (timeToReceive <= 60) return 3
  return 4
}

const createBlock = (block, blockParentInfo) => {
  const blockId = block.block
  const timeToReceive = parseInt(block.syncedtimestamp) - parseInt(block.parenttimestamp)

  return {
    id: blockId,
    key: blockId,
    height: block.height,
    miner: block.miner,
    parentWeight: block.parentweight,
    timeToReceive: `${timeToReceive}s`,
    weirdTime: isWeirdTime(timeToReceive),
    blockCid: blockId,
    minerPower: blockParentInfo[blockId] && blockParentInfo[blockId].power,
    weight: block.weight,
  }
}

const createEdge = (block, isBlockOrphan, timeToReceive) => {
  const blockId = block.block

  return {
    sourcename: blockId,
    targetname: block.parent,
    key: `${blockId}-${block.parent}-e`,
    time: timeToReceive,
    edgeWeirdTime: isWeirdTime(timeToReceive),
    isOrphan: isBlockOrphan,
  }
}

const createEmptyEdges = (block, isBlockOrphan) => {
  const blockId = block.block
  const edgesToBeAdded = []

  edgesToBeAdded.push({
    sourcename: `${blockId}-empty`,
    targetname: block.parent,
    key: `${blockId}-${block.parent}-eb`,
    edgeWeirdTime: isWeirdTime(),
    time: 0,
    isOrphan: 0,
  })

  edgesToBeAdded.push({
    sourcename: blockId,
    targetname: `${blockId}-empty`,
    key: `${blockId}-${block.parent}-ep`,
    edgeWeirdTime: isWeirdTime(),
    time: 0,
    isOrphan: isBlockOrphan,
  })

  return edgesToBeAdded
}

const blocksToChain = (blocksArr, bhRangeEnd) => {
  // format chain as expected by dc.graph.js
  const chain = {
    nodes: [],
    edges: [],
  }

  // used to store info for data transformations necessary to parse query data to right format
  const blocks = {}
  const blockParentInfo = {}
  const blockInfo = {}

  blocksArr.forEach((block) => {
    blockParentInfo[block.parent] = { power: block.parentpower }
    blockInfo[block.block] = block
  })

  blocksArr.forEach((block, index) => {
    const blockId = block.block

    // @todo: check if should be comparing parent timestamp or parent synced timestamp
    const timeToReceive = parseInt(block.syncedtimestamp) - parseInt(block.parenttimestamp)
    // block.block may appear multiple times because there are many parent child relationships
    // we want to only add the node once but add all the edges to represent the different parent/child relationships
    if (!blocks[blockId]) {
      chain.nodes.push(createBlock(block, blockParentInfo))
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
    })

    if (isDirectParent) {
      const newEdge = createEdge(block, isOrphan(block), timeToReceive)

      chain.edges.push(newEdge)
    } else if (!blocks[blockId]) {
      const newEmptyBlock = createEmptyBlock(block)
      const newEmptyEdges = createEmptyEdges(block, isOrphan(block))

      chain.nodes.push(newEmptyBlock)
      chain.edges.push(...newEmptyEdges)
    }
    blocks[blockId] = true
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

  return blocksToChain(blocksArr, blockRange[1])
}

export const fetchMore = async (blockRange, startDate, endDate, miner, chain, paging) => {
  let from = blockRange[0] - 5 * paging
  const to = blockRange[0] - 5 * (paging - 1)

  if (from < 0) {
    from = 0
  }

  const blocksArr = await getChainData({
    blockRange: [from, to],
    startDate,
    endDate,
    miner,
  })

  const chainToAppend = blocksToChain(blocksArr, blockRange[1])

  const newChain = {
    nodes: [...chain.nodes, ...chainToAppend.nodes],
    edges: [...chain.edges, ...chainToAppend.edges],
  }

  return newChain
}
