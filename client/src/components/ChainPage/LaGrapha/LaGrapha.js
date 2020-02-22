import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { fetchGraph } from '../../../context/chain/actions'
import { closeNodeModal, openNodeModal } from '../../../context/node-modal/actions'
import { selectNode } from '../../../context/selected-node/actions'
import { store } from '../../../context/store'
import ElGrapho from '../../../vendor/elgrapho/ElGrapho'
import { Loader } from '../../shared/Loader'
import { LaGrapha, LaGraphaWrapper, SaveSvg } from './la-grapha.styled'
import { NodeModal } from './NodeModal/NodeModal'
import { getSVGString } from './svg'
import { tooltip } from './tooltip'

const LaGraphaComponent = () => {
  const { state, dispatch } = useContext(store)
  const { chain, loading, filter, selectedNode, isNodeModalOpen } = state
  const { blockRange, startDate, endDate, miner, cid } = filter
  const [buildingSvg, setBuildingSvg] = useState(false)

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

  function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1])

    // separate out the mime component
    var mimeString = dataURI
      .split(',')[0]
      .split(':')[1]
      .split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length)

    // create a view into the buffer
    var ia = new Uint8Array(ab)

    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }

    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], { type: mimeString })
    return blob
  }

  const saveSvg = () => {
    if (buildingSvg) return

    const download = (blob, name) => {
      const hiddenInput = document.getElementById('hidden-input')
      const url = window.URL.createObjectURL(blob)

      hiddenInput.href = url
      hiddenInput.download = name
      hiddenInput.click()

      window.URL.revokeObjectURL(url)
    }

    setBuildingSvg(true)

    const canvas = document.getElementsByClassName('concrete-scene-canvas')[0]

    // const { width, height } = canvas.getBoundingClientRect()

    // const svgString = getSVGString(canvas, width, height)
    const data = canvas.toDataURL()
    const blob = dataURItoBlob(data)
    // const blob = new Blob(dataURItoBlob(data))

    download(blob, 'graph.png')

    setBuildingSvg(false)
  }

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
      {!loading && (
        <SaveSvg disabled={buildingSvg} onClick={saveSvg}>
          {buildingSvg && <FontAwesomeIcon icon={faCircleNotch} style={{ marginRight: '5px' }} spin />}
          Save Graph
        </SaveSvg>
      )}
      {isNodeModalOpen && <NodeModal node={selectedNode} close={() => closeNodeModal(dispatch)} />}
      <a href="javascript:;" id="hidden-input">
        file input
      </a>
    </LaGraphaWrapper>
  )
}

export { LaGraphaComponent as LaGrapha }
