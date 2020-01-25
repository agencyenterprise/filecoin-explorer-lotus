import axios from 'axios'

const { REACT_APP_API_URL } = process.env

let apiUrl = REACT_APP_API_URL || `${window.location.origin}/api`

export const getChainData = async ({ blockRange, startDate, endDate, miner }) => {
  const { data } = await axios.get(`${apiUrl}/chain`, {
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
  const { data } = await axios.get(`${apiUrl}/blocks/range`)

  return data
}
