import { getChain as getChainData } from '../../services/db/chain'
import { blocksToChain } from '../../services/elgrapho/formatAsModel'

export const getChain = async (req, res) => {
  const { startBlock, endBlock, startDate, endDate, miner, skip, limit, sortOrder } = req.query

  const blocksArr = await getChainData({
    startBlock,
    endBlock,
    startDate,
    endDate,
    miner,
    skip,
    limit,
    sortOrder,
  })
  return res.json(blocksToChain(blocksArr, endBlock, startBlock))
}
