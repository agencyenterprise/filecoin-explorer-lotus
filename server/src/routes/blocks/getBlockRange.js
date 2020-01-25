import { getBlockRange as getBlockRangeData } from '../../services/db/blocks'

export const getBlockRange = async (req, res) => {
  console.log('getting block range data')
  const blockRange = await getBlockRangeData()
  res.json(blockRange)
}
