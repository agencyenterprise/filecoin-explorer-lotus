import React, { useContext, useEffect, useRef } from 'react'
import { fetchGraph } from '../../../context/chain/actions'
import { closeNodeModal, openNodeModal } from '../../../context/node-modal/actions'
import { selectNode } from '../../../context/selected-node/actions'
import { store } from '../../../context/store'
import ElGrapho from '../../../vendor/elgrapho/ElGrapho'
import { Loader } from '../../shared/Loader'
import { LaGrapha, LaGraphaWrapper } from './la-grapha.styled'
import { NodeModal } from './NodeModal/NodeModal'
import { tooltip } from './tooltip'

const LaGraphaComponent = () => {
  const { state, dispatch } = useContext(store)
  const { chain, loading, filter, selectedNode, isNodeModalOpen } = state
  const { blockRange, startDate, endDate, miner, cid } = filter

  const laGraphaRef = useRef()

  useEffect(() => {
    if (!blockRange[1]) return

    fetchGraph(dispatch, { blockRange, startDate, endDate, miner, cid })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockRange, startDate, endDate, miner, cid])

  useEffect(() => {
    buildGraph()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain])

  const buildGraph = () => {
    const height = window.innerHeight
    const width = window.innerWidth - 306
    const numEpochsDisplayed = blockRange[1] - blockRange[0]
    const desiredInitialRange = 50
    const zoomY = numEpochsDisplayed / desiredInitialRange

    // @todo: improve this calc
    const y = desiredInitialRange / 2 - height / 2

    const { nodes, edges } = chain.chain

    if (nodes.length > 0) {
      const model = {
        nodes,
        edges,
        steps: 1,
      }

      const graph = new ElGrapho({
        container: laGraphaRef.current,
        model,
        labelSize: 0.5,
        height,
        width,
        edgeSize: 0.3,
        nodeSize: 1,
        nodeOutline: false,
      })

      graph.tooltipTemplate = (index, el) => {
        const data = nodes[index]
        const tooltipTable = tooltip(data)
        while (el.firstChild) {
          el.removeChild(el.firstChild)
        }
        el.appendChild(tooltipTable)
      }

      graph.fire('zoom-to-point', { zoomY, y })

      graph.on('node-click', ({ node }) => {
        selectNode(dispatch, node)
        openNodeModal(dispatch)
      })
    }
  }

  return (
    <LaGraphaWrapper>
      {loading && <Loader />}
      <LaGrapha ref={laGraphaRef} />
      {isNodeModalOpen && <NodeModal node={selectedNode} close={() => closeNodeModal(dispatch)} />}
    </LaGraphaWrapper>
  )
}

export { LaGraphaComponent as LaGrapha }
