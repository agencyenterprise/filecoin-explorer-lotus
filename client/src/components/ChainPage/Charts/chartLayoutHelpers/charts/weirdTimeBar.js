import { visuallyDistinctColors } from '../visuallyDistinctColorSet'
const dc = window.dc
const d3 = window.d3

export const weirdTimeBarConfig = () => {
  const weirdTimeBar = dc.rowChart('#weirdTimeBar')
  const subsetVisuallyDistinctColors = visuallyDistinctColors.slice(2, visuallyDistinctColors.length)

  const timeReceivedDecorations = [
    { color: '#000000', label: 'skipped' },
    { color: '#c4c4c4', label: '<= 48 s' },
    { color: '#AFD71C', label: '<= 51 s' },
    { color: '#eed202', label: '<= 60 s' },
    { color: '#F70000', label: '> 60s' },
  ]

  weirdTimeBar
    .width(260)
    .height(150)
    .colors(
      d3.scale
        .ordinal()
        .domain([0, 1, 2])
        .range(subsetVisuallyDistinctColors),
    )
    .label((kv) => timeReceivedDecorations[kv.key].label)
    .title((kv) => timeReceivedDecorations[kv.key].label)

  return weirdTimeBar
}
