import React, { createContext, useReducer } from 'react'

const initialState = {
  nodeCheckbox: {
    heightLabel: true,
  },
  range: [0, 0],
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
      default:
        throw new Error()
    }
  }, initialState)

  return <Provider value={{ state, dispatch }}>{children}</Provider>
}

export { store, StateProvider }
