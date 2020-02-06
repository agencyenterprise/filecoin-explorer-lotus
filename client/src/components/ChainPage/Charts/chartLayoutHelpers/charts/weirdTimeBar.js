const dc = window.dc

const weirdTimeBar = dc.rowChart('#weirdTimeBar')

weirdTimeBar
  .width(260)
  .height(150)
  .label((kv) => kv.value.label)
  .title((kv) => kv.value.label)

export { weirdTimeBar }
