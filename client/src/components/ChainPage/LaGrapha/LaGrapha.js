import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import debounce from 'lodash/debounce'
import findIndex from 'lodash/findIndex'
import findLastIndex from 'lodash/findLastIndex'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { getBlockHeight } from '../../../api'
import { fetchGraph } from '../../../context/chain/actions'
import { closeNodeModal, openNodeModal } from '../../../context/node-modal/actions'
import { selectNode } from '../../../context/selected-node/actions'
import { store } from '../../../context/store'
import { dataURItoBlob, download } from '../../../utils/download'
import ElGrapho from '../../../vendor/elgrapho/ElGrapho'
import { Loader } from '../../shared/Loader'
import { LaGrapha, LaGraphaWrapper, SaveGraph } from './la-grapha.styled'
import { NodeModal } from './NodeModal/NodeModal'
import { tooltip } from './tooltip'

const LaGraphaComponent = () => {
  const { state, dispatch } = useContext(store)
  const { chain, loading: loadingData, filter, selectedNode, isNodeModalOpen } = state
  const { blockRange, startDate, endDate, miner, cid, showHeightRuler } = filter

  const [loadingGraph, setLoading] = useState(false)
  const [buildingSvg, setBuildingSvg] = useState(false)

  const loading = loadingData || loadingGraph
  const graphRendered = !!document.getElementsByClassName('concrete-scene-canvas')[0]

  const laGraphaRef = useRef()

  const { nodes, edges } = chain.chain

  const model = {
    nodes,
    edges,
    showRuler: showHeightRuler,
  }

  const height = window.innerHeight
  const numEpochsDisplayed = blockRange[1] - blockRange[0]
  const desiredInitialRange = 15

  const y = (desiredInitialRange * ((height * 0.95) / numEpochsDisplayed)) / 2 - (height * 0.95) / 2

  const onSelectMiners = (e) => {
    // can basically simulate clicking on node to see all miners, choose first node in model to have this miner to zoom to
    const minerId = e.detail
    const index = findLastIndex(model.nodes, { miner: minerId })

    if (index < 0) {
      toast.warn('Miner not found.')

      return
    }

    window.graphInstance.fire('select-group', { index, group: 'colors' })
    // @todo: update to use current zoom and adjust for position currently in graph
    window.graphInstance.fire('zoom-to-node', { nodeY: model.nodes[index].y, initialPanY: y })
  }

  const onSelectNode = async (e) => {
    const cid = e.detail
    const index = findIndex(model.nodes, { id: cid })

    if (index < 0) {
      let blockWithHeight

      try {
        blockWithHeight = await getBlockHeight({ cid })
      } catch (error) {
        console.error('Error when fetching node', error)
        toast.error('An error has occurred while fetching node.')

        return
      }

      if (!blockWithHeight) {
        toast.error('This node was not found in our database.')

        return
      }

      toast.info(
        <div>
          This node is not in your current range. <br />
          <br />
          Change your range to include the height of <strong>{blockWithHeight.height}</strong>.
        </div>,
      )

      return
    }

    // y for pan is calculated as the desired y midpoint minus the current y midpoint. the 0.95 is because have to account for 5% padding
    window.graphInstance.fire('select-node', { index })
    // @todo: update to use current zoom and adjust for position currently in graph
    window.graphInstance.fire('zoom-to-node', { nodeY: model.nodes[index].y, initialPanY: y })
  }

  useEffect(() => {
    const handleResize = debounce(() => {
      buildGraph()
    }, 500)

    // @todo: make graph acessible outside so we can remove this logic from here

    window.addEventListener('resize', handleResize)
    window.addEventListener('select-node', onSelectNode)
    window.addEventListener('select-miners', onSelectMiners)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('select-node', onSelectNode)
      window.removeEventListener('select-miners', onSelectMiners)
    }
  })

  useEffect(() => {
    if (!blockRange[1]) return
    fetchGraph(dispatch, { blockRange, startDate, endDate, miner, cid })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockRange, startDate, endDate, miner, cid])

  useEffect(() => {
    buildGraph()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain, showHeightRuler])

  const exportGraph = () => {
    if (buildingSvg) return

    setBuildingSvg(true)

    const canvas = document.getElementsByClassName('concrete-scene-canvas')[0]

    const data = canvas.toDataURL()
    const blob = dataURItoBlob(data)

    download(blob, 'graph.png', laGraphaRef.current)

    setBuildingSvg(false)
  }

  const buildGraph = () => {
    setLoading(true)

    const height = window.innerHeight
    const width = window.innerWidth - 306
    const numEpochsDisplayed = blockRange[1] - blockRange[0]
    const desiredInitialRange = 15

    const zoomY = numEpochsDisplayed / desiredInitialRange

    // y for pan is calculated as the desired y midpoint minus the current y midpoint. the 0.95 is because have to account for 5% padding
    const y = (desiredInitialRange * ((height * 0.95) / numEpochsDisplayed)) / 2 - (height * 0.95) / 2

    const { nodes } = chain.chain

    if (nodes.length > 0) {
      try {
        window.graphInstance = new ElGrapho({
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
      } catch (error) {
        console.error('Error building graph', error)

        setLoading(false)
      }

      window.graphInstance.tooltipTemplate = (index, el) => {
        const data = nodes[index]
        const tooltipTable = tooltip(data)

        while (el.firstChild) {
          el.removeChild(el.firstChild)
        }

        el.appendChild(tooltipTable)
      }

      window.graphInstance.fire('zoom-to-point', { zoomY, y })

      window.graphInstance.on('node-click', ({ node }) => {
        selectNode(dispatch, node)
        openNodeModal(dispatch)
      })
    }
  }

  return (
    <LaGraphaWrapper>
      {loading && <Loader light={graphRendered} />}
      <LaGrapha ref={laGraphaRef} />
      {!loading && (
        <SaveGraph disabled={buildingSvg} onClick={exportGraph}>
          {buildingSvg && <FontAwesomeIcon icon={faCircleNotch} spin />}
          Save Graph
        </SaveGraph>
      )}
      {isNodeModalOpen && <NodeModal node={selectedNode} close={() => closeNodeModal(dispatch)} />}
    </LaGraphaWrapper>
  )
}

export { LaGraphaComponent as LaGrapha }
