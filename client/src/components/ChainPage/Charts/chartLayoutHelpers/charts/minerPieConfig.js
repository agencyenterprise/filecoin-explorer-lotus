import { visuallyDistinctColors } from '../visuallyDistinctColorSet'
const dc = window.dc
const d3 = window.d3

const minerPie = dc.pieChart('#minerPie')

minerPie
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

export { minerPie }
