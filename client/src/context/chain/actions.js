import { getChain } from './helper'
import { toast } from 'react-toastify'

export const fetchGraph = async (dispatch, payload) => {
  dispatch({ type: 'CHANGE_LOADING', payload: true })

  try {
    const chain = await getChain(payload)

    dispatch({ type: 'CHANGE_CHAIN', payload: chain })
  } catch (error) {
    console.error('Error in request', error)

    toast.error('An error has occurred while fetching node chain.')
  }

  dispatch({ type: 'CHANGE_LOADING', payload: false })
}
