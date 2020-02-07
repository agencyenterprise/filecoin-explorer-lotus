import { visuallyDistinctColors } from '../visuallyDistinctColorSet'
const dc = window.dc
const d3 = window.d3

export const orphanPieConfig = () => {
  const orphanPie = dc.pieChart('#orphanPie')
  const subsetVisuallyDistinctColors = visuallyDistinctColors.slice(2, visuallyDistinctColors.length)

  const orphanLabels = ['ok', 'orphan']

  orphanPie
    .width(150)
    .height(150)
    .radius(75)
    .colors(
      d3.scale
        .ordinal()
        .domain([0, 1, 2])
        .range(subsetVisuallyDistinctColors),
    )
    .label((kv) => orphanLabels[kv.key])
    .title((kv) => orphanLabels[kv.key])

  return orphanPie
}
