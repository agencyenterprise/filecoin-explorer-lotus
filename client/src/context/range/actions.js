import { constants } from '../../utils'

const resolveRangeInterval = (currentRange, newInternalBlockRange) => {
  if (newInternalBlockRange[0] > newInternalBlockRange[1]) {
    let tmp = newInternalBlockRange[1]

    newInternalBlockRange[1] = newInternalBlockRange[0]
    newInternalBlockRange[0] = tmp
  }

  if (currentRange[0] !== newInternalBlockRange[0]) {
    // note: min is moving
    if (newInternalBlockRange[1] - newInternalBlockRange[0] > constants.maxBlockRange) {
      newInternalBlockRange[1] = newInternalBlockRange[0] + constants.maxBlockRange
    }
  } else {
    // note: max is moving
    if (newInternalBlockRange[1] - newInternalBlockRange[0] > constants.maxBlockRange) {
      newInternalBlockRange[0] = newInternalBlockRange[1] - constants.maxBlockRange
    }
  }

  if (newInternalBlockRange[1] === 0) {
    newInternalBlockRange[0] = 0
    newInternalBlockRange[1] = constants.maxBlockRange
  }

  return newInternalBlockRange
}

export const changeRange = (dispatch, currentRange, newRange) => {
  const range = resolveRangeInterval(currentRange, newRange)

  dispatch({ type: 'CHANGE_RANGE', payload: { range } })

  return range
}
