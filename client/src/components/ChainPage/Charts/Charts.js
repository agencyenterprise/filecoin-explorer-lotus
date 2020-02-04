import React from 'react'
import { getChainData } from '../../../api'
import { store } from '../../../context/store'
import { Loader } from '../../shared/Loader'
import { Graph } from './charts.styled'

const dc_graph = window.dc_graph
const dc = window.dc
const sync_url_options = window.sync_url_options
const d3 = window.d3
const dcgraph_domain = window.dcgraph_domain
const querystring = window.querystring

export class Charts extends React.Component {
  static contextType = store

  state = {
    chain: {
      nodes: [],
      links: [],
    },
    nodeLabel: 'height',
    heightLabel: true,
    parentWeightLabel: false,
    weight: false,
    loading: false,
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    const { blockRange: prevBlockRange, startDate: prevStartDate, endDate: prevEndDate, miner: prevMiner } = prevProps
    const { blockRange, startDate, endDate, miner } = this.props

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
      await this.getChain(blockRange[0], blockRange[1])
      // rerender graph on new db info
      this.renderGraph()
    }
  }

  async getChain(bhRangeStart, bhRangeEnd) {
    let loading = true
    this.setState({ loading })

    const { startDate, endDate, miner } = this.props
    const blocksArr = await getChainData({
      blockRange: [bhRangeStart, bhRangeEnd],
      startDate,
      endDate,
      miner,
    })
    const chain = {
      nodes: [],
      edges: [],
    }
    const blocks = {}
    const isWeirdTime = (timeToReceive) => {
      if (timeToReceive <= 48) {
        return 0
      } else if (timeToReceive <= 51) {
        return 1
      } else if (timeToReceive <= 60) {
        return 2
      } else {
        return 3
      }
    }

    // block.block may appear multiple times
    const blockInfo = {}
    blocksArr.forEach((block, index) => {
      const timeToReceive = parseInt(block.timestamp) - parseInt(block.parenttimestamp)
      if (!blocks[block.block]) {
        blocks[block.block] = index
        blockInfo[block.block] = block
        chain.nodes.push({
          id: blocks[block.block],
          key: blocks[block.block].toString(),
          height: block.height,
          miner: block.miner,
          parentWeight: block.parentweight,
          timeToReceive: `${timeToReceive}s`,
          weirdTime: isWeirdTime(timeToReceive),
          blockCid: block.block,
          minerPower: block.power,
          weight: block.weight,
        })
      }

      if (block.parentheight && block.height && parseInt(block.parentheight) !== parseInt(block.height) - 1) {
        chain.nodes.push({
          key: `${blocks[block.block]}-empty`,
          height: null,
          miner: '0',
          parentWeight: block.parentweight,
          weirdTime: 4,
        })
        chain.edges.push({
          sourcename: `${blocks[block.block]}-empty`,
          targetname: blocks[block.parent],
          key: `${blocks[block.block]}-eb`,
          time: 0,
          dash: 0,
        })
        chain.edges.push({
          sourcename: blocks[block.block],
          targetname: `${blocks[block.block]}-empty`,
          key: `${blocks[block.block]}-ep`,
          time: 0,
          dash: 0,
        })
      } else {
        const edge = {
          sourcename: blocks[block.block],
          targetname: blocks[block.parent],
          key: `${index}-e`,
          time: timeToReceive,
        }
        edge.dash = isWeirdTime(timeToReceive)

        chain.edges.push(edge)
      }
    })
    this.setState({ chain })
  }

  build_data(nodes, edges) {
    // build crossfilters from scratch
    return {
      edgef: dc_graph.flat_group.make(edges, (d) => d.key),
      nodef: dc_graph.flat_group.make(nodes, (d) => d.key),
    }
  }

  populate(n) {
    const data = this.build_data(this.state.chain.nodes, this.state.chain.edges)

    const minerDimension = data.nodef.crossfilter.dimension((n) => n.miner)
    const minerGroup = minerDimension.group()

    const blockHeightDimension = data.nodef.crossfilter.dimension((n) => n.height)
    const blockHeightGroup = blockHeightDimension.group()

    const weirdTimeDimension = data.edgef.crossfilter.dimension((e) => e.dash)
    const weirdTimeGroup = weirdTimeDimension.group()

    this.selectionDiagram
      .nodeDimension(data.nodef.dimension)
      .nodeGroup(data.nodef.group)
      .edgeDimension(data.edgef.dimension)
      .edgeGroup(data.edgef.group)

    this.minerPie.dimension(minerDimension).group(minerGroup)
    this.blockHeightPie.dimension(blockHeightDimension).group(blockHeightGroup)
    this.weirdTimeBar.dimension(weirdTimeDimension).group(weirdTimeGroup)
  }

  renderGraph() {
    this.selectionDiagram = dc_graph.diagram('#graph')
    window.selectionDiagram = this.selectionDiagram

    this.minerPie = dc.pieChart('#minerPie')
    this.blockHeightPie = dc.pieChart('#blockHeightPie')
    this.weirdTimeBar = dc.rowChart('#weirdTimeBar')

    this.options = {
      layout: {
        default: 'dagre',
      },
      worker: {
        default: false,
      },
      n: {
        default: 100,
        values: [1, 5, 10, 20, 50, 100, 200],
        selector: '#number',
        needs_redraw: true,
        exert: (val, diagram) => {
          this.populate(val)
          diagram.autoZoom('once')
        },
      },
      transition_duration: {
        query: 'tdur',
        default: 1000,
      },
      arrows: {
        default: 'none',
      },
    }
    this.sync_url = sync_url_options(this.options, dcgraph_domain(this.selectionDiagram), this.selectionDiagram)

    const apply_engine_parameters = (engine) => {
      switch (engine.layoutAlgorithm()) {
        case 'd3v4-force':
          engine
            .collisionRadius(25)
            .gravityStrength(0.05)
            .initialCharge(-500)
          break
        case 'd3-force':
          engine.gravityStrength(0.1).initialCharge(-1000)
          break
        default:
          // to nothing
          break
      }

      return engine
    }

    const engine = dc_graph.spawn_engine(this.sync_url.vals.layout, querystring.parse(), this.sync_url.vals.worker)
    apply_engine_parameters(engine)
    // maximally distinct colors from: https://graphicdesign.stackexchange.com/revisions/3815/8
    // prettier-ignore
    const colors = ["#FFFFFF","#000000","#FFFF00","#1CE6FF","#FF34FF","#FF4A46","#008941","#006FA6","#A30059","#FFDBE5","#7A4900","#0000A6","#63FFAC","#B79762","#004D43","#8FB0FF","#997D87","#5A0007","#809693","#FEFFE6","#1B4400","#4FC601","#3B5DFF","#4A3B53","#FF2F80","#61615A","#BA0900","#6B7900","#00C2A0","#FFAA92","#FF90C9","#B903AA","#D16100","#DDEFFF","#000035","#7B4F4B","#A1C299","#300018","#0AA6D8","#013349","#00846F","#372101","#FFB500","#C2FFED","#A079BF","#CC0744","#C0B9B2","#C2FF99","#001E09","#00489C","#6F0062","#0CBD66","#EEC3FF","#456D75","#B77B68","#7A87A1","#788D66","#885578","#FAD09F","#FF8A9A","#D157A0","#BEC459","#456648","#0086ED","#886F4C","#34362D","#B4A8BD","#00A6AA","#452C2C","#636375","#A3C8C9","#FF913F","#938A81","#575329","#00FECF","#B05B6F","#8CD0FF","#3B9700","#04F757","#C8A1A1","#1E6E00","#7900D7","#A77500","#6367A9","#A05837","#6B002C","#772600","#D790FF","#9B9700","#549E79","#FFF69F","#201625","#72418F","#BC23FF","#99ADC0","#3A2465","#922329","#5B4534","#FDE8DC","#404E55","#0089A3","#CB7E98","#A4E804","#324E72","#6A3A4C","#83AB58","#001C1E","#D1F7CE","#004B28","#C8D0F6","#A3A489","#806C66","#222800","#BF5650","#E83000","#66796D","#DA007C","#FF1A59","#8ADBB4","#1E0200","#5B4E51","#C895C5","#320033","#FF6832","#66E1D3","#CFCDAC","#D0AC94","#7ED379","#012C58","#7A7BFF","#D68E01","#353339","#78AFA1","#FEB2C6","#75797C","#837393","#943A4D","#B5F4FF","#D2DCD5","#9556BD","#6A714A","#001325","#02525F","#0AA3F7","#E98176","#DBD5DD","#5EBCD1","#3D4F44","#7E6405","#02684E","#962B75","#8D8546","#9695C5","#E773CE","#D86A78","#3E89BE","#CA834E","#518A87","#5B113C","#55813B","#E704C4","#00005F","#A97399","#4B8160","#59738A","#FF5DA7","#F7C9BF","#643127","#513A01","#6B94AA","#51A058","#A45B02","#1D1702","#E20027","#E7AB63","#4C6001","#9C6966","#64547B","#97979E","#006A66","#391406","#F4D749","#0045D2","#006C31","#DDB6D0","#7C6571","#9FB2A4","#00D891","#15A08A","#BC65E9","#FFFFFE","#C6DC99","#203B3C","#671190","#6B3A64","#F5E1FF","#FFA0F2","#CCAA35","#374527","#8BB400","#797868","#C6005A","#3B000A","#C86240","#29607C","#402334","#7D5A44","#CCB87C","#B88183","#AA5199","#B5D6C3","#A38469","#9F94F0","#A74571","#B894A6","#71BB8C","#00B433","#789EC9","#6D80BA","#953F00","#5EFF03","#E4FFFC","#1BE177","#BCB1E5","#76912F","#003109","#0060CD","#D20096","#895563","#29201D","#5B3213","#A76F42","#89412E","#1A3A2A","#494B5A","#A88C85","#F4ABAA","#A3F3AB","#00C6C8","#EA8B66","#958A9F","#BDC9D2","#9FA064","#BE4700","#658188","#83A485","#453C23","#47675D","#3A3F00","#061203","#DFFB71","#868E7E","#98D058","#6C8F7D","#D7BFC2","#3C3E6E","#D83D66","#2F5D9B","#6C5E46","#D25B88","#5B656C","#00B57F","#545C46","#866097","#365D25","#252F99","#00CCFF","#674E60","#FC009C","#92896B"];
    const timeReceivedDecorations = [
      { color: '#4BB543', ray: null, label: '<= 48 s' },
      { color: '#AFD71C', ray: null, label: '<= 51 s' },
      { color: '#eed202', ray: null, label: '<= 60 s' },
      { color: '#F70000', ray: null, label: '> 60s' },
      { color: '#000000', ray: null, label: 'skipped' },
    ]

    this.selectionDiagram
      .layoutEngine(engine)
      .timeLimit(5000)
      .transitionDuration(this.sync_url.vals.transition_duration)
      .fitStrategy(this.sync_url.vals.fit || 'vertical')
      .zoomExtent([0.1, 1.5])
      .restrictPan(true)
      .margins({ top: 20, left: 20, right: 20, bottom: 20 })
      .autoZoom('once-noanim')
      .zoomDuration(this.sync_url.vals.transition_duration)
      .width('auto')
      .height('auto')
      .mouseZoomable(true)
      .nodeOrdering((n) => n.value.height)
      .nodeStrokeWidth(0) // turn off outlines
      .nodeLabel((n) => {
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
      .edgeLabel((n) => `${n.value.time}`)
      .nodeLabelFill((n) => {
        const rgb = d3.rgb(this.selectionDiagram.nodeFillScale()(this.selectionDiagram.nodeFill()(n))),
          // https://www.w3.org/TR/AERT#color-contrast
          brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000

        return brightness > 127 ? 'black' : 'ghostwhite'
      })
      .nodeFill((kv) => kv.value.miner)
      .nodeOpacity(0.25)
      .edgeOpacity(0.25)
      .timeLimit(1000)
      .nodeFillScale(
        d3.scale
          .ordinal()
          .domain([0, 1, 2])
          .range(colors),
      )
      .nodeTitle(null)
      .edgeStrokeDashArray((e) => timeReceivedDecorations[e.value.dash].ray)
      .edgeStroke('#c4c4c4')
      .nodeStroke((kv) => timeReceivedDecorations[kv.value.weirdTime].color)
      .nodeStrokeWidth(3)
      .edgeArrowhead(this.sync_url.vals.arrows === 'head' || this.sync_url.vals.arrows === 'both' ? 'vee' : null)
      .edgeArrowtail(this.sync_url.vals.arrows === 'tail' || this.sync_url.vals.arrows === 'both' ? 'crow' : null)

    var tip = dc_graph.tip()

    const toSentence = (camelCase) => {
      const withSpace = camelCase.replace(/([A-Z])/g, ' $1').toLowerCase()
      const withFirstCharUppercase = withSpace.charAt(0).toUpperCase() + withSpace.slice(1)

      return withFirstCharUppercase
    }

    var tooltipContent = dc_graph.tip.html_or_json_table().json((d) => {
      const data = d.orig.value

      let toolTipInfo = {}

      let hasValues = false

      ;['height', 'parentWeight', 'timeToReceive', 'miner', 'blockCid', 'id', 'minerPower', 'weight'].forEach((key) => {
        if (data[key] !== undefined) {
          hasValues = true

          const value = Number(data[key])
          toolTipInfo[toSentence(key)] = isNaN(value) ? data[key] : value
        }
      })

      if (!hasValues) return null

      return JSON.stringify(toolTipInfo)
    })

    tip.showDelay(250).content(tooltipContent)

    this.selectionDiagram.child('tip', tip)

    const selectNodes = dc_graph
      .select_nodes({ nodeOpacity: 1 })
      .noneIsAll(true)
      .autoCropSelection(false)

    this.selectionDiagram.child('select-nodes', selectNodes)

    this.selectionDiagram.child('filter-selection-nodes', dc_graph.filter_selection('select-nodes'))

    this.selectionDiagram.child(
      'fix-nodes',
      dc_graph.fix_nodes({
        fixedPosTag: 'fixed',
      }),
    )

    const selectEdges = dc_graph
      .select_edges({
        edgeStrokeWidth: 2,
        edgeOpacity: 1,
      })
      .noneIsAll(true)
      .autoCropSelection(false)

    this.selectionDiagram.child('select-edges', selectEdges)

    const filterSelectionEdges = dc_graph
      .filter_selection('select-edges-group', 'select-edges')
      .dimensionAccessor((c) => c.edgeDimension())

    this.selectionDiagram.child('filter-selection-edges', filterSelectionEdges)

    this.selectionDiagram.child(
      'highlight-neighbors',
      dc_graph
        .highlight_neighbors({
          edgeStroke: 'blue',
          edgeStrokeWidth: 3,
        })
        .durationOverride(0),
    )

    this.minerPie
      .width(150)
      .height(150)
      .radius(75)
      .colors(
        d3.scale
          .ordinal()
          .domain([0, 1, 2])
          .range(colors),
      )
      .label((n) => n.key)
      .title((kv) => kv.key)

    this.blockHeightPie
      .width(150)
      .height(150)
      .radius(75)
      .colors(
        d3.scale
          .ordinal()
          .domain([0, 1, 2])
          .range(colors),
      )
      .label((n) => n.key)
      .title((kv) => kv.key)

    this.weirdTimeBar
      .width(260)
      .height(150)
      .label((kv) => timeReceivedDecorations[kv.key].label)
      .title((kv) => timeReceivedDecorations[kv.key].label)

    this.populate(this.sync_url.vals.n)

    dc.renderAll()

    let loading = false
    this.setState({ loading })
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

  render() {
    const { loading } = this.state

    return (
      <>
        {loading && <Loader />}
        <Graph id="graph" />
      </>
    )
  }
}
