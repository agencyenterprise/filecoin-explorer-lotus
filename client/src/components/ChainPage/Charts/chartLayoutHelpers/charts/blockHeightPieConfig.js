import { visuallyDistinctColors } from '../visuallyDistinctColorSet'
const dc = window.dc
const d3 = window.d3

const blockHeightPie = dc.pieChart('#blockHeightPie')

blockHeightPie
  .width(150)
  .height(150)
  .radius(75)
  .colors(
    d3.scale
      .ordinal()
      .domain([0, 1, 2])
      .range(visuallyDistinctColors),
  )
  .label((n) => n.key)
  .title((kv) => kv.key)

export { blockHeightPie }
