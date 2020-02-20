import { getChain as getChainData, getOrphans } from '../../services/db/chain'

export const getChain = async (req, res) => {
  const { startBlock, endBlock, startDate, endDate, miner, cid, skip, limit, sortOrder } = req.query

  const query = {
    startBlock,
    endBlock,
    startDate,
    endDate,
    miner,
    cid,
    skip,
    limit,
    sortOrder,
  }

  const chain = await getChainData(query)
  const orphans = await getOrphans(query)

  res.json({
    chain,
    orphans,
  })
}
