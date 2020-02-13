import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { store } from '../../../context/store'
import { Loader } from '../../shared/Loader'
import ElGrapho from '../../../vendor/elgrapho/ElGrapho'
import { apply_engine_parameters } from './chartLayoutHelpers/applyEngineParams'
import { chartOptions } from './chartLayoutHelpers/chartOptions'
// import { blockHeightPieConfig } from './chartLayoutHelpers/charts/blockHeightPieConfig'
// import { minerPieConfig } from './chartLayoutHelpers/charts/minerPieConfig'
// import { orphanPieConfig } from './chartLayoutHelpers/charts/orphanPieConfig'
// import { selectionDiagramConfig } from './chartLayoutHelpers/charts/selectionDiagramConfig'
// import { weirdTimeBarConfig } from './chartLayoutHelpers/charts/weirdTimeBar'
import { fetchMore, getChain } from './chartLayoutHelpers/getChain'
import { getSVGString, svgString2Image } from './chartLayoutHelpers/svg'
import { visuallyDistinctColors } from './chartLayoutHelpers/visuallyDistinctColorSet'
import { Graph, SaveSvg } from './charts.styled'

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
    paging: {
      top: 1,
      bottom: 1,
    },
    nodeLabel: 'height',
    heightLabel: true,
    parentWeightLabel: false,
    disableMinerColor: false,
    disableTipsetColor: false,
    weight: false,
    loading: false,
    fetching: false,
    buildingSvg: false,
  }

  spaceListener = async ({
    detail: {
      top: { space: topSpace, difference: topDifference },
      bottom: { space: bottomSpace, difference: bottomDifference },
    },
  }) => {
    // todo: need to update this to account for moving the graph a lot at once
    const { fetching } = this.state

    const shouldFetchFromTop = topSpace > 200 && topDifference > 0
    const shouldFetchFromBottom = bottomSpace > 200 && bottomDifference > 0
    const shouldFetch = shouldFetchFromTop || shouldFetchFromBottom

    if (!fetching && shouldFetch) {
      this.setState({ fething: true })

      await this.fetchMore(!!shouldFetchFromTop)

      this.setState({ fething: false })
    }
  }

  componentDidMount() {
    document.addEventListener('space', this.spaceListener)
  }

  componentWillUnmount() {
    document.removeEventListener('space', this.spaceListener)
  }

  saveSvg = () => {
    const { buildingSvg } = this.state

    if (buildingSvg) return

    const download = (blob, name) => {
      const hiddenInput = document.getElementById('hidden-input')
      const url = window.URL.createObjectURL(blob)

      hiddenInput.href = url
      hiddenInput.download = name
      hiddenInput.click()

      window.URL.revokeObjectURL(url)
    }

    this.setState({ buildingSvg: true })

    const svg = document.getElementById('graph').children[0]
    const draw = document.getElementsByClassName('draw')[0]

    let tmp = draw.getAttribute('transform')

    draw.setAttribute('transform', 'scale(0.5)')

    const { width, height } = draw.getBoundingClientRect()

    const svgString = getSVGString(svg, width + 50, height + 50)
    const blob = new Blob([svgString])

    download(blob, 'graph.svg')

    this.setState({ buildingSvg: false })
    draw.setAttribute('transform', tmp)
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

      this.setState({ chain, paging: { top: 1, bottom: 1 } })
      const height = window.innerHeight
      const width = window.innerWidth - 305
      const numEpochsDisplayed = blockRange[1] - blockRange[0]
      const desiredInitialRange = 50
      const zoomY = numEpochsDisplayed / desiredInitialRange
      // @todo: improve this calc
      const y = desiredInitialRange / 2 - height / 2

      if (chain.nodes.length > 0) {
        let model = {
          nodes: chain.nodes,
          edges: chain.edges,
          steps: 1,
        }
        const graph = new ElGrapho({
          container: document.getElementById('container'),
          model: model,
          darkMode: true,
          glowBlend: 0,
          labelSize: 0.5,
          height,
          width,
        })
        graph.fire('zoom-to-point', { zoomY, y })
      }

      // rerender graph on new db info because redraw doesn't always work with lots of new data
      // this.renderGraph()
      this.setState({ loading: false })
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

  // renderGraph() {
  //   this.minerPie = minerPieConfig()
  //   this.blockHeightPie = blockHeightPieConfig()
  //   this.orphanPie = orphanPieConfig()
  //   this.weirdTimeBar = weirdTimeBarConfig()

  //   this.sync_url = sync_url_options(chartOptions, dcgraph_domain(this.selectionDiagram), this.selectionDiagram)

  //   const engine = dc_graph.spawn_engine(this.sync_url.vals.layout, querystring.parse(), this.sync_url.vals.worker)
  //   apply_engine_parameters(engine)

  //   this.selectionDiagram = selectionDiagramConfig(engine, this.sync_url, this.context.state.nodeCheckbox)
  //   this.selectionDiagram.nodeLabel((n) => {
  //     const { heightLabel, parentWeightLabel, weight } = this.context.state.nodeCheckbox
  //     const { height, parentWeight, weight: nWeight } = n.value

  //     let label = ``
  //     if (heightLabel && height) {
  //       label += ` ${height}`
  //     }

  //     if (parentWeightLabel && parentWeight) {
  //       label += `\n ${parentWeight}`
  //     }

  //     if (weight && nWeight) {
  //       label += `\n ${nWeight}`
  //     }

  //     return label
  //   })

  //   this.selectionDiagram
  //     .nodeStroke((kv) => {
  //       const { disableTipsetColor } = this.context.state.nodeCheckbox
  //       if (!disableTipsetColor) {
  //         const tipsetVal = kv.value.tipset % visuallyDistinctColors.length
  //         return visuallyDistinctColors[tipsetVal]
  //       }
  //       return null
  //     })
  //     .nodeStrokeWidth(6)

  //   this.selectionDiagram.nodeFill((kv) => {
  //     const { disableMinerColor } = this.context.state.nodeCheckbox
  //     if (!disableMinerColor) {
  //       return kv.value.miner
  //     }
  //     return 0
  //   })

  //   this.populate(this.sync_url.vals.n)

  //   dc.renderAll()

  //   this.setState({ loading: false })
  // }

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

  fetchMore = async (inverse) => {
    const { blockRange, startDate, endDate, miner, maxBlock } = this.props
    const { chain, paging } = this.state

    this.setState({ loading: true })

    const newChain = await fetchMore(blockRange, maxBlock, startDate, endDate, miner, chain, paging, inverse)

    const { top, bottom } = paging

    this.setState(
      {
        loading: false,
        chain: newChain,
        paging: {
          top: inverse ? top + 1 : top,
          bottom: inverse ? bottom : bottom + 1,
        },
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
    const { loading, buildingSvg, chain } = this.state

    return (
      <>
        {loading && <Loader />}
        <div id="container"></div>
        <Graph id="graph">
          {!loading && (
            <SaveSvg disabled={buildingSvg} onClick={this.saveSvg}>
              {buildingSvg && <FontAwesomeIcon icon={faCircleNotch} style={{ marginRight: '5px' }} spin />}
              Save Graph
            </SaveSvg>
          )}
        </Graph>
        <a href="javascript:;" id="hidden-input"></a>
      </>
    )
  }
}
