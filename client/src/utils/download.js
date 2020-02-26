export const dataURItoBlob = (dataURI) => {
  const byteString = atob(dataURI.split(',')[1])

  const mimeString = dataURI
    .split(',')[0]
    .split(':')[1]
    .split(';')[0]

  // write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(byteString.length)

  // create a view into the buffer
  const ia = new Uint8Array(ab)

  // set the bytes of the buffer to the correct values
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }

  // write the ArrayBuffer to a blob, and you're done
  const blob = new Blob([ab], { type: mimeString })

  return blob
}

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
