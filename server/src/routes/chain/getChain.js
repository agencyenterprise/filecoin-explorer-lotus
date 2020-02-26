import { getChain as getChainData, getMessagesCount, getOrphans } from '../../services/db/chain'
import { blocksToChain } from '../../services/elgrapho/formatAsModel'

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

  const blocksArr = await getChainData(query)
  const chain = blocksToChain(blocksArr, endBlock, startBlock)
  const orphans = await getOrphans(query)

  res.json({
    chain,
    orphans,
  })
}
