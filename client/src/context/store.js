import React, { createContext, useReducer } from 'react'

const initialState = {
  range: [0, 0],
  currentSection: 1,
  selectedNode: {},
  isNodeModalOpen: false,
  loading: false,
  chain: {
    chain: {
      nodes: [],
      edges: [],
    },
    total: 0,
    miners: [],
    orphans: [],
    timeToReceive: {
      total: 0,
      under3: {
        total: 0,
        percentage: 0,
        nodes: [],
      },
      between3and6: {
        total: 0,
        percentage: 0,
        nodes: [],
      },
      between6and15: {
        total: 0,
        percentage: 0,
        nodes: [],
      },
      above15: {
        total: 0,
        percentage: 0,
        nodes: [],
      },
    },
  },
  filter: {
    blockRange: [],
    minBlock: 0,
    maxBlock: 0,
    miner: '',
    startDate: '',
    endDate: '',
    showHeightRuler: true,
  },
}

const store = createContext(initialState)

const { Provider } = store

// TODO: extract each provider to its own file/state
const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
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
      case 'CHANGE_LOADING':
        return {
          ...state,
          loading: action.payload,
        }
      case 'CHANGE_CHAIN':
        return {
          ...state,
          chain: action.payload,
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
