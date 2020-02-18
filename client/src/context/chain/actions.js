import { getChain } from './helper'

export const fetchGraph = async (dispatch, { blockRange, startDate, endDate, miner }) => {
  dispatch({ type: 'CHANGE_LOADING', payload: true })

  const chain = await getChain({ blockRange, startDate, endDate, miner })

  dispatch({ type: 'CHANGE_CHAIN', payload: chain })
  dispatch({ type: 'CHANGE_LOADING', payload: false })
}
