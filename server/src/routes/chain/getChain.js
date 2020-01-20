import { getChain as getChainData } from '../../services/db/chain';

export const getChain = async (req, res) => {
  console.log('in show chain')
  const { startBlock, endBlock, startDate, endDate, miner } = req.query;
  let { skip, limit, sortOrder } = req.query;

  const chain = await getChainData({
    startBlock,
    endBlock,
    startDate,
    endDate,
    miner,
    skip,
    limit,
    sortOrder,
  });
  res.json(chain)
}
