import axios from 'axios'
import { config } from '../config'

export const getChainData = async ({ blockRange, startDate, endDate, miner }) => {
  const { data } = await axios.get(`${config.apiUrl}/chain`, {
    params: {
      startBlock: blockRange[0],
      endBlock: blockRange[1],
      startDate,
      endDate,
      miner,
    },
  })

  return data
}

export const getBlockRange = async () => {
  const { data } = await axios.get(`${config.apiUrl}/blocks/range`)

  return data
}
