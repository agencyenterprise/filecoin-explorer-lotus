import React, { createContext, useReducer } from 'react'

const initialState = {
  nodeCheckbox: {
    heightLabel: true,
  },
  range: [0, 0],
  currentSection: 1,
  selectedNode: {},
  isNodeModalOpen: false,
  filter: {
    blockRange: [],
    minBlock: 0,
    maxBlock: 0,
    miner: '',
    startDate: '',
    endDate: '',
  },
}

const store = createContext(initialState)

const { Provider } = store

// TODO: extract each provider to its own file/state
const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'CHANGE_NODE_CHECKBOX':
        const { key, value } = action.payload

        return {
          ...state,
          nodeCheckbox: {
            ...state.nodeCheckbox,
            [key]: value,
          },
        }
      case 'CHANGE_RANGE':
        const { range } = action.payload

        return {
          ...state,
          range,
        }
      case 'SELECTED_NODE':
        return {
          ...state,
          selectedNode: action.payload,
        }
      case 'OPEN_NODE_MODAL':
        return {
          ...state,
          isNodeModalOpen: true,
        }
      case 'CLOSE_NODE_MODAL':
        return {
          ...state,
          isNodeModalOpen: false,
        }
      case 'CHANGE_FILTER':
        const { key: filterKey, value: filterValue } = action.payload

        return {
          ...state,
          filter: {
            ...state.filter,
            [filterKey]: filterValue,
          },
        }
      default:
        throw new Error()
    }
  }, initialState)

  return <Provider value={{ state, dispatch }}>{children}</Provider>
}

export { store, StateProvider }
