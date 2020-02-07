import React from 'react'
import { visuallyDistinctColors } from './chartLayoutHelpers/visuallyDistinctColorSet'
import { store } from '../../../context/store'
import { Loader } from '../../shared/Loader'
import { Graph } from './charts.styled'
import { getChain, fetchMore } from './chartLayoutHelpers/getChain'
import { chartOptions } from './chartLayoutHelpers/chartOptions'
import { apply_engine_parameters } from './chartLayoutHelpers/applyEngineParams'
import { selectionDiagramConfig } from './chartLayoutHelpers/charts/selectionDiagramConfig'
import { minerPieConfig } from './chartLayoutHelpers/charts/minerPieConfig'
import { blockHeightPieConfig } from './chartLayoutHelpers/charts/blockHeightPieConfig'
import { orphanPieConfig } from './chartLayoutHelpers/charts/orphanPieConfig'
import { weirdTimeBarConfig } from './chartLayoutHelpers/charts/weirdTimeBar'

const dc_graph = window.dc_graph
const dc = window.dc
const sync_url_options = window.sync_url_options
const dcgraph_domain = window.dcgraph_domain
const querystring = window.querystring

export class Charts extends React.Component {
  static contextType = store

  state = {
    chain: {
      nodes: [],
      links: [],
    },
    paging: 1,
    nodeLabel: 'height',
    heightLabel: true,
    parentWeightLabel: false,
    disableMinerColor: false,
    disableTipsetColor: false,
    weight: false,
    loading: false,
  }

  componentDidMount() {
    // todo: need to update this to account for moving the graph a lot at once
    let fetching = false

    document.addEventListener('bottomSpace', async ({ detail: { space, difference } }) => {
      if (!fetching && space > 200 && difference > 0) {
        fetching = true
        await this.fetchMore()
        fetching = false
      }
    })
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

      this.setState({ chain, paging: 1 })

      // rerender graph on new db info because redraw doesn't always work with lots of new data
      this.renderGraph()
    }
  }

  build_data(nodes, edges) {
    // build crossfilters from scratch
    return {
      edgef: dc_graph.flat_group.make(edges, (d) => d.key),
      nodef: dc_graph.flat_group.make(nodes, (d) => d.key),
    }
  }

  populate() {
    const data = this.build_data(this.state.chain.nodes, this.state.chain.edges)

    const minerDimension = data.nodef.crossfilter.dimension((n) => n.miner)
    const minerGroup = minerDimension.group()

    const blockHeightDimension = data.nodef.crossfilter.dimension((n) => n.height)
    const blockHeightGroup = blockHeightDimension.group()

    const weirdTimeDimension = data.edgef.crossfilter.dimension((e) => e.edgeWeirdTime)
    const weirdTimeGroup = weirdTimeDimension.group()

    const orphanDimension = data.edgef.crossfilter.dimension((e) => e.isOrphan)
    const orphanGroup = orphanDimension.group()

    this.selectionDiagram
      .nodeDimension(data.nodef.dimension)
      .nodeGroup(data.nodef.group)
      .edgeDimension(data.edgef.dimension)
      .edgeGroup(data.edgef.group)

    this.minerPie.dimension(minerDimension).group(minerGroup)
    this.blockHeightPie.dimension(blockHeightDimension).group(blockHeightGroup)
    this.orphanPie.dimension(orphanDimension).group(orphanGroup)
    this.weirdTimeBar.dimension(weirdTimeDimension).group(weirdTimeGroup)
  }

  renderGraph() {
    this.minerPie = minerPieConfig()
    this.blockHeightPie = blockHeightPieConfig()
    this.orphanPie = orphanPieConfig()
    this.weirdTimeBar = weirdTimeBarConfig()

    this.sync_url = sync_url_options(chartOptions, dcgraph_domain(this.selectionDiagram), this.selectionDiagram)

    const engine = dc_graph.spawn_engine(this.sync_url.vals.layout, querystring.parse(), this.sync_url.vals.worker)
    apply_engine_parameters(engine)

    this.selectionDiagram = selectionDiagramConfig(engine, this.sync_url, this.context.state.nodeCheckbox)
    this.selectionDiagram.nodeLabel((n) => {
      const { heightLabel, parentWeightLabel, weight } = this.context.state.nodeCheckbox
      const { height, parentWeight, weight: nWeight } = n.value

      let label = ``
      if (heightLabel && height) {
        label += ` ${height}`
      }

      if (parentWeightLabel && parentWeight) {
        label += `\n ${parentWeight}`
      }

      if (weight && nWeight) {
        label += `\n ${nWeight}`
      }

      return label
    })

    this.selectionDiagram
      .nodeStroke((kv) => {
        const { disableTipsetColor } = this.context.state.nodeCheckbox
        if (!disableTipsetColor) {
          const tipsetVal = kv.value.tipset % visuallyDistinctColors.length
          return visuallyDistinctColors[tipsetVal]
        }
        return null
      })
      .nodeStrokeWidth(6)

    this.selectionDiagram.nodeFill((kv) => {
      const { disableMinerColor } = this.context.state.nodeCheckbox
      if (!disableMinerColor) {
        return kv.value.miner
      }
      return 0
    })

    this.populate(this.sync_url.vals.n)

    dc.renderAll()

    this.setState({ loading: false })
  }

  redrawGraph = () => {
    this.populate(this.sync_url.vals.n)
    this.selectionDiagram.redraw()
    this.minerPie.redraw()
    this.blockHeightPie.redraw()
    this.weirdTimeBar.redraw()
    let loading = false
    this.setState({ loading })
  }

  changeNodeLabel = async (event) => {
    this.setState({ [event.target.value]: event.target.checked }, () => {
      this.selectionDiagram.redraw()
    })
  }

  fetchMore = async () => {
    const { blockRange, startDate, endDate, miner } = this.props
    const { chain, paging } = this.state

    this.setState({ loading: true })

    const newChain = await fetchMore(blockRange, startDate, endDate, miner, chain, paging)

    this.setState(
      {
        loading: false,
        chain: newChain,
        paging: this.state.paging + 1,
      },
      () => {
        // need to redraw the other graphs also or the filtering wont work
        this.redrawGraph()
        // const data = this.build_data(newChain.nodes, newChain.edges)

        // this.selectionDiagram
        //   .nodeDimension(data.nodef.dimension)
        //   .nodeGroup(data.nodef.group)
        //   .edgeDimension(data.edgef.dimension)
        //   .edgeGroup(data.edgef.group)
        //   .redraw()
      },
    )
  }

  render() {
    const { loading } = this.state

    return (
      <>
        {loading && <Loader />}
        <Graph id="graph">{/* {!loading && <FetchMore onClick={this.fetchMore}>Fetch more</FetchMore>} */}</Graph>
      </>
    )
  }
}
