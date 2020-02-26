export const download = (blob, name, parent) => {
  let parentNode = parent || document.body

  const hiddenInput = document.createElement('a')
  hiddenInput.setAttribute('id', 'hidden-input')
  parentNode.appendChild(hiddenInput)

  // const hiddenInput = document.getElementById('hidden-input')
  const url = window.URL.createObjectURL(blob)

  hiddenInput.href = url
  hiddenInput.download = name
  hiddenInput.click()

  window.URL.revokeObjectURL(url)
  parentNode.removeChild(hiddenInput)
}
