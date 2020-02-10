const getCSSStyles = (parentElement) => {
  let selectorTextArr = []

  // Add Parent element Id and Classes to the list
  selectorTextArr.push('#' + parentElement.id)
  for (let c = 0; c < parentElement.classList.length; c++)
    if (!contains('.' + parentElement.classList[c], selectorTextArr))
      selectorTextArr.push('.' + parentElement.classList[c])

  // Add Children element Ids and Classes to the list
  let nodes = parentElement.getElementsByTagName('*')
  for (let i = 0; i < nodes.length; i++) {
    let id = nodes[i].id
    if (!contains('#' + id, selectorTextArr)) selectorTextArr.push('#' + id)

    let classes = nodes[i].classList
    for (let c = 0; c < classes.length; c++)
      if (!contains('.' + classes[c], selectorTextArr)) selectorTextArr.push('.' + classes[c])
  }

  // Extract CSS Rules
  let extractedCSSText = ''
  for (let i = 0; i < document.styleSheets.length; i++) {
    let s = document.styleSheets[i]

    try {
      if (!s.cssRules) continue
    } catch (e) {
      if (e.name !== 'SecurityError') throw e // for Firefox
      continue
    }

    let cssRules = s.cssRules
    for (let r = 0; r < cssRules.length; r++) {
      if (contains(cssRules[r].selectorText, selectorTextArr)) extractedCSSText += cssRules[r].cssText
    }
  }

  return extractedCSSText
}

const contains = (str, arr) => (arr.indexOf(str) === -1 ? false : true)

const appendCSS = (cssText, element) => {
  let styleElement = document.createElement('style')
  styleElement.setAttribute('type', 'text/css')
  styleElement.innerHTML = cssText
  let refNode = element.hasChildNodes() ? element.children[0] : null
  element.insertBefore(styleElement, refNode)
}

export const getSVGString = (svgNode, width, height) => {
  svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink')
  let cssStyleText = getCSSStyles(svgNode)
  appendCSS(cssStyleText, svgNode)

  let serializer = new XMLSerializer()
  let svgString = serializer.serializeToString(svgNode)

  svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink=') // Fix root xlink without namespace
  svgString = svgString.replace(/NS\d+:href/g, 'xlink:href') // Safari NS namespace fix
  svgString = svgString.replace('width="100%"', `width="${width}"`)
  svgString = svgString.replace('height="100%"', `height="${height}" style="background-color: #f7f7f7"`)
  svgString = svgString.replace(/<g class="draw" transform=".*?"/, '<g class="draw" transform="scale(0.5)"')

  return svgString
}
