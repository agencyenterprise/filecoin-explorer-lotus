import { getChainData } from '../../api'
import { palette } from '../../utils/palette'

export const getChain = async ({ blockRange, startDate, endDate, miner, cid }) => {
  const { chain, orphans } = await getChainData({
    blockRange: [blockRange[0], blockRange[1]],
    startDate,
    endDate,
    miner,
    cid,
  })

  const miners = mapMiners(chain)
  const timeToReceive = mapTimeToReceive(chain)

  return {
    chain,
    total: chain.nodes.length,
    miners,
    orphans,
    timeToReceive,
  }
}

const mapTimeToReceive = (chain) => {
  const table = {
    under3: {
      total: 0,
      percentage: 0,
      nodes: [],
    },
    between3and6: {
      total: 0,
      percentage: 0,
      nodes: [],
    },
    between6and15: {
      total: 0,
      percentage: 0,
      nodes: [],
    },
    above15: {
      total: 0,
      percentage: 0,
      nodes: [],
    },
  }

  chain.nodes.forEach((node) => {
    if (node.timeToReceiveRaw < 3000) {
      table.under3.nodes.push(node)
    } else if (node.timeToReceiveRaw >= 3000 && node.timeToReceiveRaw < 6000) {
      table.between3and6.nodes.push(node)
    } else if (node.timeToReceiveRaw >= 6000 && node.timeToReceiveRaw < 15000) {
      table.between6and15.nodes.push(node)
    } else {
      table.above15.nodes.push(node)
    }
  })

  const total = chain.nodes.length

  Object.keys(table).forEach((key) => {
    table[key].total = table[key].nodes.length
    table[key].percentage = toDecimal((table[key].total * 100) / total)
  })

  table.total = total

  return table
}

const toDecimal = (n) => Math.round(n * 100) / 100

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

    const currentPalette = palette[paletteIndex++]
    return {
      ...miner,
      color: currentPalette.color,
      fontColor: currentPalette.isDark ? '#fff' : '#212121',
    }
  })

  return minersWithColor
}
