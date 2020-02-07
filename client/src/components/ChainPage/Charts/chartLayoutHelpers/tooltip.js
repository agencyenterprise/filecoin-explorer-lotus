const dc_graph = window.dc_graph
const tip = dc_graph.tip()

const toSentence = (camelCase) => {
  const withSpace = camelCase.replace(/([A-Z])/g, ' $1').toLowerCase()
  const withFirstCharUppercase = withSpace.charAt(0).toUpperCase() + withSpace.slice(1)

  return withFirstCharUppercase
}

const tooltipContent = dc_graph.tip.html_or_json_table().json((d) => {
  const data = d.orig.value

  let toolTipInfo = {
    [data.miner]: '',
  }

  let hasValues = false

  ;['height', 'parentWeight', 'timeToReceive', 'blockCid', 'miner', 'minerPower'].forEach((key) => {
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

export { tip }
