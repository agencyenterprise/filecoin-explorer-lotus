import { getBlockRange as getBlockRangeData } from '../../services/db/blocks'

export const getBlockRange = async (req, res) => {
  console.log('getting block range data')

  let blockRange
  try {
    blockRange = await getBlockRangeData()
  } catch (e) {
    console.log('Error on query', e)
  }

  res.json(blockRange)
}
