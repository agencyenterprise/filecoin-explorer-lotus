import { BadRequestError } from 'error-middleware/errors'
import { getGraph as getGraphData } from '../../services/db/chain'

export const getGraph = async (req, res) => {
  const { start, end } = req.query
  if (!start || !end) throw new BadRequestError('start and end are required query params')

  const blocksArr = await getGraphData({ start, end })
  const chain = {
    nodes: [],
    links: [],
  }
  const blocks = {}

  blocksArr.forEach((block) => {
    blocks[block.block] = chain.nodes.length
    chain.nodes.push({
      id: blocks[block.block],
      name: `${block.miner}:${block.height}`,
      miner: block.miner,
      //name: blocks[block.block],
      //title: block.block
    })
    chain.links.push({
      sourcename: blocks[block.block],
      targetname: blocks[block.parent],
    })
  })

  res.json(chain)
}
