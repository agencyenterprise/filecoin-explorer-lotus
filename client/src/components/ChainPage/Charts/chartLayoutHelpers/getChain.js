import { getChainData } from '../../../../api'

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

  // used to store info for data transformations necessary to parse query data to right format
  const blocks = {}
  const blockParentInfo = {}
  const blockInfo = {}

  const isWeirdTime = (timeToReceive) => {
    if (!timeToReceive) {
      return { color: '#000000', label: 'skipped' }
    }
    if (timeToReceive <= 48) {
      return { color: '#c4c4c4', label: '<= 48 s' }
    } else if (timeToReceive <= 51) {
      return { color: '#AFD71C', label: '<= 51 s' }
    } else if (timeToReceive <= 60) {
      return { color: '#eed202', label: '<= 60 s' }
    } else {
      return { color: '#F70000', label: '> 60s' }
    }
  }

  const isOrphan = (block) => {
    return blockParentInfo[block.block] && bhRangeEnd !== block.height
      ? { ray: null, label: '' }
      : { ray: [5, 5], label: 'orphan' }
  }

  const defaultEmptyNode = (block) => {
    return {
      key: `${blocks[block.block]}-empty`,
      height: null,
      miner: '0',
      parentWeight: block.parentweight,
      weirdTime: isWeirdTime(),
    }
  }

  blocksArr.map((block) => {
    blockParentInfo[block.parent] = { power: block.parentpower }
    blockInfo[block.block] = block
  })
  let dups = 0
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
      const emptyNode = defaultEmptyNode(block)
      console.log('empty node', emptyNode, blockInfo[block.block])
      chain.nodes.push(emptyNode)
      dups += 1
      chain.edges.push({
        sourcename: `${blocks[block.block]}-empty`,
        targetname: blocks[block.parent],
        key: `${blocks[block.block]}-eb`,
        edgeWeirdTime: isWeirdTime(),
        time: 0,
        isOrphan: 0,
      })
      chain.edges.push({
        sourcename: blocks[block.block],
        targetname: `${blocks[block.block]}-empty`,
        key: `${blocks[block.block]}-ep`,
        edgeWeirdTime: isWeirdTime(),
        time: 0,
        isOrphan: isOrphan(block),
      })
    } else {
      const edge = {
        sourcename: blocks[block.block],
        targetname: blocks[block.parent],
        key: `${index}-e`,
        time: timeToReceive,
      }
      edge.edgeWeirdTime = isWeirdTime(timeToReceive)
      edge.isOrphan = isOrphan(block)
      chain.edges.push(edge)
    }
  })
  return chain
}
