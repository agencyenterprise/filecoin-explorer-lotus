import { getChain as getChainData } from '../../services/db/chain'

export const getChain = async (req, res) => {
  const { startBlock, endBlock, startDate, endDate, miner, skip, limit, sortOrder } = req.query

  const chain = await getChainData({
    startBlock,
    endBlock,
    startDate,
    endDate,
    miner,
    skip,
    limit,
    sortOrder,
  })

  res.json(chain)
}
