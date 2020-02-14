import React, { Component } from 'react'
import { store } from '../../../context/store'
import ElGrapho from '../../../vendor/elgrapho/ElGrapho'
import { Loader } from '../../shared/Loader'
import { getChain } from '../Charts/chartLayoutHelpers/getChain'
import { LaGrapha } from './la-grapha.styled'

const toSentence = (camelCase) => {
  const withSpace = camelCase.replace(/([A-Z])/g, ' $1').toLowerCase()
  const withFirstCharUppercase = withSpace.charAt(0).toUpperCase() + withSpace.slice(1)

  return withFirstCharUppercase
}

class LaGraphaComponent extends Component {
  static contextType = store

  state = {
    chain: {
      nodes: [],
      links: [],
    },
    loading: false,
  }

  constructor(props) {
    super(props)

    this.laGraphaRef = React.createRef()
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    const { blockRange: prevBlockRange, startDate: prevStartDate, endDate: prevEndDate, miner: prevMiner } = prevProps
    const { blockRange, startDate, endDate, miner } = this.props

    // if changed input for sql then refetch query and reparse for graph
    if (
      blockRange.length === 2 &&
      blockRange[1] &&
      (prevBlockRange.length !== 2 ||
        prevBlockRange[0] !== blockRange[0] ||
        prevBlockRange.length !== 2 ||
        prevBlockRange[1] !== blockRange[1] ||
        prevStartDate !== startDate ||
        prevEndDate !== endDate ||
        prevMiner !== miner)
    ) {
      this.setState({ loading: true })

      const chain = await getChain(blockRange, startDate, endDate, miner)

      const height = window.innerHeight
      const width = window.innerWidth - 361
      const numEpochsDisplayed = blockRange[1] - blockRange[0]
      const desiredInitialRange = 50
      const zoomY = numEpochsDisplayed / desiredInitialRange

      // @todo: improve this calc
      const y = desiredInitialRange / 2 - height / 2

      if (chain.nodes.length > 0) {
        const model = {
          nodes: chain.nodes,
          edges: chain.edges,
          steps: 1,
        }

        const graph = new ElGrapho({
          container: this.laGraphaRef.current,
          model,
          labelSize: 0.5,
          height,
          width,
          edgeSize: 0.3,
          darkMode: true,
          nodeOutline: false,
        })
        graph.tooltipTemplate = function(index, el) {
          const data = chain.nodes[index]
          let toolTipInfo = {
            [data.miner]: '',
          }

          let hasValues = false

          ;['height', 'parentWeight', 'timeToReceive', 'blockCid', 'miner', 'minerPower'].forEach((key, index) => {
            if (data[key] !== undefined) {
              hasValues = true

              const value = Number(data[key])
              if (isNaN(value)) {
                toolTipInfo[toSentence(key)] = { value: data[key], position: index }
              } else {
                toolTipInfo[toSentence(key)] = { value, position: index }
              }
            }
          })

          if (!hasValues) return null

          const table = document.createElement('table')
          for (let info in toolTipInfo) {
            const row = table.insertRow(toolTipInfo[info].position)
            const infoKey = row.insertCell(0)
            const infoValue = row.insertCell(1)
            infoKey.innerHTML = info
            infoValue.innerHTML = toolTipInfo[info].value
          }
          while (el.firstChild) {
            el.removeChild(el.firstChild)
          }
          el.appendChild(table)
        }
        graph.fire('zoom-to-point', { zoomY, y })
      }

      this.setState({ loading: false })
    }
  }

  render() {
    const { loading } = this.state

    return (
      <>
        {loading && <Loader />}
        <LaGrapha ref={this.laGraphaRef} />
      </>
    )
  }
}

export { LaGraphaComponent as LaGrapha }
