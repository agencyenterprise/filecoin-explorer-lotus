import { getChainData } from '../../api'

export const getChain = async ({ blockRange, startDate, endDate, miner }) => {
  const chain = await getChainData({
    blockRange: [blockRange[0], blockRange[1]],
    startDate,
    endDate,
    miner,
  })
  return chain
}
