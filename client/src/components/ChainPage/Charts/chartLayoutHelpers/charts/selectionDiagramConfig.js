import { visuallyDistinctColors } from '../visuallyDistinctColorSet'
import { tip } from '../tooltip'
const dc_graph = window.dc_graph
const d3 = window.d3

export const selectionDiagramConfig = (engine, sync_url) => {
  const selectionDiagram = dc_graph.diagram('#graph')
  window.selectionDiagram = selectionDiagram

  selectionDiagram
    .layoutEngine(engine)
    .timeLimit(5000)
    .transitionDuration(sync_url.vals.transition_duration)
    .fitStrategy(sync_url.vals.fit || 'vertical')
    .zoomExtent([0.1, 1.5])
    .restrictPan(false)
    .margins({ top: 20, left: 20, right: 20, bottom: 20 })
    .autoZoom('once-noanim')
    .zoomDuration(sync_url.vals.transition_duration)
    .width('auto')
    .height('auto')
    .mouseZoomable(true)
    .nodeOrdering((n) => n.value.height)
    .nodeStrokeWidth(0) // turn off outlines
    .edgeLabel((n) => `${n.value.time}`)
    .nodeLabelFill((n) => {
      const rgb = d3.rgb(selectionDiagram.nodeFillScale()(selectionDiagram.nodeFill()(n))),
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
        .range(visuallyDistinctColors),
    )
    .nodeTitle(null)
    .edgeStrokeDashArray((e) => {
      return e.value.isOrphan.ray
    })
    .edgeStroke((e) => e.value.edgeWeirdTime.color)
    .nodeStroke((kv) => kv.value.weirdTime.color)
    .nodeStrokeWidth(3)
    .edgeArrowhead(sync_url.vals.arrows === 'head' || sync_url.vals.arrows === 'both' ? 'vee' : null)
    .edgeArrowtail(sync_url.vals.arrows === 'tail' || sync_url.vals.arrows === 'both' ? 'crow' : null)

  // add all the child elements
  selectionDiagram.child('tip', tip)

  const selectNodes = dc_graph
    .select_nodes({ nodeOpacity: 1 })
    .noneIsAll(true)
    .multipleSelect(false)
    .autoCropSelection(false)

  selectionDiagram.child('select-nodes', selectNodes)

  selectionDiagram.child('filter-selection-nodes', dc_graph.filter_selection('select-nodes'))

  selectionDiagram.child(
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
    .multipleSelect(false)
    .autoCropSelection(false)

  selectionDiagram.child('select-edges', selectEdges)

  const filterSelectionEdges = dc_graph
    .filter_selection('select-edges-group', 'select-edges')
    .dimensionAccessor((c) => c.edgeDimension())

  selectionDiagram.child('filter-selection-edges', filterSelectionEdges)

  selectionDiagram.child(
    'highlight-neighbors',
    dc_graph
      .highlight_neighbors({
        edgeStroke: 'blue',
        edgeStrokeWidth: 3,
      })
      .durationOverride(0),
  )

  return selectionDiagram
}