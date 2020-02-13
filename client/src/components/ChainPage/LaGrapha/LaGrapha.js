import React, { Component } from 'react'
import { store } from '../../../context/store'
import ElGrapho from '../../../vendor/elgrapho/ElGrapho'
import { Loader } from '../../shared/Loader'
import { getChain } from '../Charts/chartLayoutHelpers/getChain'
import { LaGrapha } from './la-grapha.styled'

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
      const width = window.innerWidth - 305
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
          glowBlend: 0,
          labelSize: 0.5,
          height,
          width,
        })
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
