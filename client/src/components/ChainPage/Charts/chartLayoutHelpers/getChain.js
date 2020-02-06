import { getChainData } from '../../../../api'

const isWeirdTime = (timeToReceive) => {
  if (!timeToReceive) return { color: '#000000', label: 'skipped' }

  if (timeToReceive <= 48) return { color: '#c4c4c4', label: '<= 48 s' }
  if (timeToReceive <= 51) return { color: '#AFD71C', label: '<= 51 s' }
  if (timeToReceive <= 60) return { color: '#eed202', label: '<= 60 s' }

  return { color: '#F70000', label: '> 60s' }
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
    key: `${blockId}-e`,
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
    key: `${blockId}-eb`,
    edgeWeirdTime: isWeirdTime(),
    time: 0,
    isOrphan: 0,
  })

  edgesToBeAdded.push({
    sourcename: blockId,
    targetname: `${blockId}-empty`,
    key: `${blockId}-ep`,
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
      blocks[blockId] = true

      chain.nodes.push(createBlock(block, blockParentInfo))
    }

    const isDirectParent = Number(block.parentheight) === Number(block.height) - 1

    const isOrphan = (block) => {
      return blockParentInfo[block.block] && bhRangeEnd !== block.height
        ? { ray: null, label: '' }
        : { ray: [5, 5], label: 'orphan' }
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
    } else {
      const newEmptyBlock = createEmptyBlock(block)
      const newEmptyEdges = createEmptyEdges(block, isOrphan(block))

      chain.nodes.push(newEmptyBlock)
      chain.edges.push(...newEmptyEdges)
    }
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
