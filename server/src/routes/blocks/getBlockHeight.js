import { getBlockHeight as getBlockHeightData } from '../../services/db/blocks'
import { BadRequestError, NotFoundError } from 'error-middleware/errors'

export const getBlockHeight = async (req, res) => {
  const { id } = req.params

  const block = await getBlockHeightData(id)

  res.json(block)
}
