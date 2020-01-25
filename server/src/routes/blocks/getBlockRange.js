import { getBlockRange as getBlockRangeData } from '../../services/db/blocks'

export const getBlockRange = async (req, res) => {
  const blockRange = await getBlockRangeData()

  res.json(blockRange)
}
