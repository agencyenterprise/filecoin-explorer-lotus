import { getChainData } from '../../../api'

export async function getChain(bhRangeStart, bhRangeEnd, startDate, endDate, miner) {
  // get block data from db
  const blocksArr = await getChainData({
    blockRange: [bhRangeStart, bhRangeEnd],
    startDate,
    endDate,
    miner,
  })

  // format chain as expected by dc.graph.js
  const chain = {
    nodes: [],
    edges: [],
  }

  const isWeirdTime = (timeToReceive) => {
    if (timeToReceive <= 48) {
      return 0
    } else if (timeToReceive <= 51) {
      return 1
    } else if (timeToReceive <= 60) {
      return 2
    } else {
      return 3
    }
  }

  const blocks = {}
  const blockParentInfo = {}
  blocksArr.map((block) => {
    blockParentInfo[block.parent] = { power: block.parentpower }
  })
  blocksArr.forEach((block, index) => {
    // @todo: check if should be comparing parent timestamp or parent synced timestamp
    const timeToReceive = parseInt(block.syncedtimestamp) - parseInt(block.parenttimestamp)
    // block.block may appear multiple times because there are many parent child relationships
    // we want to only add the node once but add all the edges to represent the different parent/child relationships
    if (!blocks[block.block]) {
      blocks[block.block] = index
      chain.nodes.push({
        id: blocks[block.block],
        key: blocks[block.block].toString(),
        height: block.height,
        miner: block.miner,
        parentWeight: block.parentweight,
        timeToReceive: `${timeToReceive}s`,
        weirdTime: isWeirdTime(timeToReceive),
        blockCid: block.block,
        minerPower: blockParentInfo[block.block] && blockParentInfo[block.block].power,
        weight: block.weight,
      })
    }

    if (block.parentheight && block.height && parseInt(block.parentheight) !== parseInt(block.height) - 1) {
      chain.nodes.push({
        key: `${blocks[block.block]}-empty`,
        height: null,
        miner: '0',
        parentWeight: block.parentweight,
        weirdTime: 0,
      })
      chain.edges.push({
        sourcename: `${blocks[block.block]}-empty`,
        targetname: blocks[block.parent],
        key: `${blocks[block.block]}-eb`,
        time: 0,
        edgeTimeReceived: 0,
        isOrphan: 0,
      })
      chain.edges.push({
        sourcename: blocks[block.block],
        targetname: `${blocks[block.block]}-empty`,
        key: `${blocks[block.block]}-ep`,
        time: 0,
        edgeTimeReceived: 0,
        isOrphan: blockParentInfo[block.block] && bhRangeEnd !== block.height ? 0 : 1,
      })
    } else {
      const edge = {
        sourcename: blocks[block.block],
        targetname: blocks[block.parent],
        key: `${index}-e`,
        time: timeToReceive,
      }
      edge.edgeTimeReceived = isWeirdTime(timeToReceive)
      edge.isOrphan = blockParentInfo[block.block] && bhRangeEnd !== block.height ? 0 : 1
      chain.edges.push(edge)
    }
  })
  return chain
}
