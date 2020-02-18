export const selectNode = (dispatch, selectedNode) => {
  dispatch({ type: 'SELECTED_NODE', payload: selectedNode })
}
