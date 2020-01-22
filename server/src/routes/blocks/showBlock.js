import { BadRequestError } from 'error-middleware/errors'
import { getBlockById } from '../../services/db/blocks'

export const showBlock = async (req, res) => {
  const { id } = req.params
  if (!id) throw new BadRequestError('id is required query params')

  const block = await getBlockById(id)
  res.json(block)
}
