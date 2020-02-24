const toSentence = (camelCase) => {
  const withSpace = camelCase.replace(/([A-Z])/g, ' $1').toLowerCase()
  const withFirstCharUppercase = withSpace.charAt(0).toUpperCase() + withSpace.slice(1)

  return withFirstCharUppercase
}

export const tooltip = (data) => {
  let toolTipInfo = {}

  let hasValues = false
  let presentInfoCount = 0

  ;['height', 'parentWeight', 'timeToReceive', 'blockCid', 'miner', 'minerPower'].forEach((key) => {
    if (data[key] !== undefined) {
      hasValues = true

      const value = Number(data[key])
      if (isNaN(value)) {
        toolTipInfo[toSentence(key)] = { value: data[key], position: presentInfoCount }
      } else {
        toolTipInfo[toSentence(key)] = { value, position: presentInfoCount }
      }
      presentInfoCount += 1
    }
  })

  if (!hasValues) return null

  const table = document.createElement('table')
  for (let info in toolTipInfo) {
    const row = table.insertRow(toolTipInfo[info].position)
    const infoKey = row.insertCell(0)
    const infoValue = row.insertCell(1)
    infoKey.innerHTML = info
    infoValue.innerHTML = toolTipInfo[info].value
  }
  return table
}
