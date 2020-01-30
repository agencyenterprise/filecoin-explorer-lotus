import React, { createContext, useReducer } from 'react'

const initialState = {
  nodeCheckbox: {
    heightLabel: true,
  },
}
const store = createContext(initialState)

const { Provider } = store

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
      default:
        throw new Error()
    }
  }, initialState)

  return <Provider value={{ state, dispatch }}>{children}</Provider>
}

export { store, StateProvider }
