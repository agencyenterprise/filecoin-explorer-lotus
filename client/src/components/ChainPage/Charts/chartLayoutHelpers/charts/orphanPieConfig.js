const dc = window.dc

const orphanPie = dc.pieChart('#orphanPie')

orphanPie
  .width(150)
  .height(150)
  .radius(75)
  .label((kv) => kv.value.label)
  .title((kv) => kv.value.label)

export { orphanPie }
