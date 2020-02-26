import { findIndex } from 'lodash'

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

// todo: need to update this to minimize length of edges or some simplified version that will accurately show side chains forming
// maybe will be easier to calculate if tipsets aren't randomly ordered but ordered so that like tipsets are at similar x positions
const calcX = (block, blocksAtTipset, tipsetsAtHeight, empty) => {
  const numTipsets = tipsetsAtHeight[block.height].length
  const centerTipset = Math.floor(numTipsets / 2)
  const tipsetKeyDefault = tipsetKeyFormatter(block)
  const tipsetKey = empty ? `${block.block}-e` : tipsetKeyDefault
  const positionOfCurrentTipset = findIndex(tipsetsAtHeight[block.height], { tipset: tipsetKey })
  // add some padding around the tipset area
  // need to update this calc here to account for ones in the middle
  const tipsetMidPoint = (positionOfCurrentTipset - centerTipset) / numTipsets
  // from range -1 to 1
  const tipsetArea = (1 / numTipsets) * 0.7
  const tipsetStartingPoint = tipsetMidPoint - tipsetArea / 2
  const numBlocksInTipset = blocksAtTipset[tipsetKey].length
  const positionOfCurrentBlock = blocksAtTipset[tipsetKey].indexOf(block.block) + 1
  const xPos = tipsetStartingPoint + tipsetArea * (1 / (numBlocksInTipset + 1)) * positionOfCurrentBlock

  return xPos
}

const createBlock = (block, blockParentInfo, tipsets, miners, blockXPos, start, range) => {
  const blockId = block.block
  const timeToReceive = parseInt(block.syncedtimestamp) - parseInt(block.timestamp)
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
    x: blockXPos[block.block],
    y: (block.height - start) / range,
    timestamp: block.timestamp,
    messages: block.messages,
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

const createEmptyEdges = (block, isBlockOrphan, blockIndices) => {
  const blockId = block.block
  const edgesToBeAdded = []
  if (blockIndices[block.parent]) {
    edgesToBeAdded.push({
      from: blockIndices[`${blockId}-e`],
      to: blockIndices[block.parent],
      key: `${blockId}-${block.parent}-eb`,
      isOrphan: 0,
    })
  }

  edgesToBeAdded.push({
    from: blockIndices[blockId],
    to: blockIndices[`${blockId}-e`],
    key: `${blockId}-${block.parent}-ep`,
    isOrphan: isBlockOrphan,
  })

  return edgesToBeAdded
}

export const blocksToChain = (blocksArr, bhRangeEnd, bhRangeStart) => {
  // format chain as expected by elgrapho
  const range = bhRangeEnd - bhRangeStart || 1
  const start = bhRangeStart || 0
  const blockXPos = {}
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
  const minerCount = {}
  const blocksAtTipset = {}
  const tipsetsAtHeight = {}
  const blockInfo = {}
  const blockParents = {}

  blocksArr.forEach((block, index) => {
    const isDirectParent = Number(block.parentheight) === Number(block.height) - 1
    if (isDirectParent) {
      blockParents[block.block]
        ? blockParents[block.block].push(block.parent)
        : (blockParents[block.block] = [block.parent])
    } else {
      blockParents[`${block.block}-e`]
        ? blockParents[`${block.block}-e`].push(block.parent)
        : (blockParents[`${block.block}-e`] = [block.parent])

      blockParents[block.block]
        ? blockParents[block.block].push(`${block.block}-e`)
        : (blockParents[block.block] = [`${block.block}-e`])
    }

    // blocksArr has duplicate blocks to establish the block - parent relationship, but we only need to do this for each unique block
    if (!blockInfo[block.block]) {
      minerCount[block.miner] = minerCount[block.miner] ? minerCount[block.miner] + 1 : 1
      blockParentInfo[block.parent] = { power: block.parentpower, parentstateroot: block.parentstateroot }
      const tipsetKey = tipsetKeyFormatter(block)
      // make groups for tipsets and miners to be used in select tool
      if (!tipsets[tipsetKey]) {
        tipsets[tipsetKey] = index
      }
      if (!miners[block.miner]) {
        miners[block.miner] = index
      }

      // save what blocks are in each tipset so can calc x for each specific block after placing tipsets
      if (!blocksAtTipset[tipsetKey]) {
        blocksAtTipset[tipsetKey] = [block.block]
      } else {
        blocksAtTipset[tipsetKey].push(block.block)
      }

      // organize tipsets for each height so can place them along x axis
      if (!tipsetsAtHeight[block.height]) {
        tipsetsAtHeight[block.height] = [{ tipset: tipsetKey, parentweight: block.parentweight, numBlocks: 1 }]
      } else if (findIndex(tipsetsAtHeight[block.height], { tipset: tipsetKey }) === -1) {
        tipsetsAtHeight[block.height].push({ tipset: tipsetKey, parentweight: block.parentweight, numBlocks: 1 })
      } else {
        const tipsetIndex = findIndex(tipsetsAtHeight[block.height], { tipset: tipsetKey })
        tipsetsAtHeight[block.height][tipsetIndex].numBlocks += 1
      }

      // empty blocks will be added to indicate nodes that have a parent from a previous epoch(skipped an epoch in chain)
      // need to add that here to use in our calculation of where to place tipsets on x axis
      if (!isDirectParent && block.height > parseInt(bhRangeStart) + 1) {
        const emptyNode = { tipset: `${block.block}-e`, parentweight: 0, numBlocks: 0, empty: true }
        tipsetsAtHeight[block.height - 1]
          ? tipsetsAtHeight[block.height - 1].push(emptyNode)
          : (tipsetsAtHeight[block.height - 1] = [emptyNode])

        blocksAtTipset[`${block.block}-e`]
          ? blocksAtTipset[`${block.block}-e`].push(`${block.block}-e`)
          : (blocksAtTipset[`${block.block}-e`] = [`${block.block}-e`])

        blockInfo[`${block.block}-e`] = { block: block.block, height: block.height - 1 }
      }
    }
    blockInfo[block.block] = block
  })

  // find semi-optimal ordering for tipsets at same y axis position so can place them along x axis appropriately
  // we care about -- 1. heaviest tipset should be in center for easier visualization 2. minimize edge crossings

  // put heaviest tipset in middle
  const orderHeaviestTipset = (tipsets = []) => {
    let heaviestTipset = tipsets[0]
    const middlePosition = Math.floor(tipsets.length / 2)
    if (tipsets.length > 1) {
      let heaviestTipsetsIndex = 0
      tipsets.forEach((tipset, index) => {
        if (tipset.parentweight > heaviestTipset.parentweight) {
          heaviestTipset = tipset
          heaviestTipsetsIndex = index
        }
      })

      const currentMiddle = tipsets[middlePosition]
      tipsets[middlePosition] = heaviestTipset
      tipsets[heaviestTipsetsIndex] = currentMiddle
    }
    return { heaviestTipset }
  }

  // calcXPositions of nodes at height
  const calcXPosOfNodesAtHeight = (height) => {
    const tipsetsCurrentHeight = tipsetsAtHeight[height] || []

    for (let t of tipsetsCurrentHeight) {
      if (blocksAtTipset[t.tipset]) {
        const { empty } = t
        for (let blockCID of blocksAtTipset[t.tipset]) {
          const block = blockInfo[blockCID]
          blockXPos[blockCID] = calcX(block, blocksAtTipset, tipsetsAtHeight, empty)
        }
      }
    }
  }

  const orderTipsetsAtHeightByPrevVertexMedian = (height) => {
    const tipsetsCurrentHeight = tipsetsAtHeight[height] || []

    // put heaviest in middle and then put surrounding tipsets around it
    const { heaviestTipset } = orderHeaviestTipset(tipsetsCurrentHeight)
    // for each block in tipset, find the x value of the parents and then find the median
    const tipsetMedianXPos = {}
    const tipsetsToLeft = []
    const tipsetsToRight = []
    for (let tipset of tipsetsCurrentHeight) {
      const parentXPos = []
      // blocks in same tipset have same parents so only need to check parents of one block
      for (let blockParent of blockParents[blocksAtTipset[tipset.tipset][0]]) {
        if (blockXPos[blockParent] || blockXPos[blockParent] === 0) {
          parentXPos.push(blockXPos[blockParent])
        }
      }
      // get left median of xpos
      const sortedParentXPos = parentXPos.sort((a, b) => a - b)
      let median
      const midPosition = (sortedParentXPos.length - 1) / 2
      if (midPosition === parseInt(midPosition)) {
        median = sortedParentXPos[midPosition]
      } else {
        median = (sortedParentXPos[Math.floor(midPosition)] + sortedParentXPos[Math.ceil(midPosition)]) / 2
      }
      tipsetMedianXPos[tipset.tipset] = median
    }

    const medianOfHeaviestTipset = tipsetMedianXPos[heaviestTipset.tipset]

    for (let tipset of tipsetsCurrentHeight) {
      if (tipset.tipset !== heaviestTipset.tipset) {
        if (tipsetMedianXPos[tipset.tipset] < medianOfHeaviestTipset) {
          tipsetsToLeft.push({ ...tipset, median: tipsetMedianXPos[tipset.tipset] })
        } else {
          tipsetsToRight.push({ ...tipset, median: tipsetMedianXPos[tipset.tipset] })
        }
      }
    }
    tipsetsToLeft.sort((a, b) => {
      return a.median < b.median ? -1 : 1
    })
    tipsetsToRight.sort((a, b) => {
      return a.median < b.median ? -1 : 1
    })
    // force them to be equal so that heaviest always in middle
    while (tipsetsToLeft.length < tipsetsToRight.length) {
      tipsetsToLeft.unshift('faketipset')
    }

    while (tipsetsToRight.length < tipsetsToLeft.length) {
      tipsetsToRight.push('faketipset')
    }

    tipsetsAtHeight[height] = [...tipsetsToLeft, ...[heaviestTipset], ...tipsetsToRight]
    calcXPosOfNodesAtHeight(height)
  }
  // get x positions for first height
  orderHeaviestTipset(tipsetsAtHeight[bhRangeStart])
  calcXPosOfNodesAtHeight(bhRangeStart)

  for (let height in tipsetsAtHeight) {
    orderTipsetsAtHeightByPrevVertexMedian(height)
  }

  blocksArr.forEach((block, index) => {
    const blockId = block.block

    // @todo: check if should be comparing parent timestamp or parent synced timestamp
    const timeToReceive = parseInt(block.syncedtimestamp) - parseInt(block.timestamp)
    // block.block may appear multiple times because there are many parent child relationships
    // we want to only add the node once but add all the edges to represent the different parent/child relationships
    if (!blocks[blockId]) {
      const chainLength = chain.nodes.push(
        createBlock(block, blockParentInfo, tipsets, miners, blockXPos, start, range),
      )
      blockIndices[blockId] = chainLength - 1
    }

    const isDirectParent = Number(block.parentheight) === Number(block.height) - 1

    const isOrphan = (block) => {
      return blockParentInfo[block.block] && bhRangeEnd !== block.height ? 0 : 1
    }

    const createEmptyBlock = (block, blockXPos) => {
      const blockId = block.block
      return {
        id: blockId,
        key: blockId,
        height: block.height,
        parentweight: 0,
        group: null,
        label: 'skipped',
        miner: null,
        minerColor: null,
        x: blockXPos[block.block],
        y: (block.height - start) / range,
        timestamp: block.timestamp,
        messages: block.messages,
      }
    }

    if (isDirectParent && blockIndices[blockId] && blockIndices[block.parent]) {
      const newEdge = createEdge(block, isOrphan(block), timeToReceive, blockIndices)
      chain.edges.push(newEdge)
    } else if (!blocks[blockId] && block.height > parseInt(bhRangeStart) + 1) {
      const emptyBlock = { ...block, block: `${block.block}-e`, height: block.height - 1 }
      const newEmptyBlock = createEmptyBlock(emptyBlock, blockXPos)
      const chainLength = chain.nodes.push(newEmptyBlock)
      blockIndices[`${blockId}-e`] = chainLength - 1
      const newEmptyEdges = createEmptyEdges(block, isOrphan(block), blockIndices)
      chain.edges.push(...newEmptyEdges)
    }

    blocks[blockId] = index
  })

  // push fake nodes so that chain renders in only half the available width for easier zooomoing
  chain.nodes.push({ y: 0, x: -1 }, { y: 0, x: 1 })
  chain.miners = minerCount
  return chain
}
