import React, { useContext, useEffect, useRef, useState } from 'react'
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
  const { chain, loading: loadingData, filter, selectedNode, isNodeModalOpen } = state
  const { blockRange, startDate, endDate, miner, cid, showHeightRuler } = filter

  const [loadingGraph, setLoading] = useState(false)

  const loading = loadingData || loadingGraph
  const graphRendered = !!document.getElementsByClassName('concrete-scene-canvas')[0]

  const laGraphaRef = useRef()

  useEffect(() => {
    if (!blockRange[1]) return

    fetchGraph(dispatch, { blockRange, startDate, endDate, miner, cid })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockRange, startDate, endDate, miner, cid])

  useEffect(() => {
    buildGraph()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain, showHeightRuler])

  const buildGraph = () => {
    setLoading(true)

    const height = window.innerHeight
    const width = window.innerWidth - 306
    const numEpochsDisplayed = blockRange[1] - blockRange[0]
    const desiredInitialRange = 15
    const zoomY = numEpochsDisplayed / desiredInitialRange
    // y for pan is calculated as the desired y midpoint minus the current y modpoint. the 0.95 is because have to account for 5% padding
    const y = (desiredInitialRange * ((height * 0.95) / numEpochsDisplayed)) / 2 - (height * 0.95) / 2

    const { nodes, edges } = chain.chain

    if (nodes.length > 0) {
      const model = {
        nodes,
        edges,
        steps: 1,
        showRuler: showHeightRuler,
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
        darkMode: 1,
        callback: () => {
          setLoading(false)
        },
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
      {loading && <Loader light={graphRendered} />}
      <LaGrapha ref={laGraphaRef} />
      {isNodeModalOpen && <NodeModal node={selectedNode} close={() => closeNodeModal(dispatch)} />}
    </LaGraphaWrapper>
  )
}

export { LaGraphaComponent as LaGrapha }
