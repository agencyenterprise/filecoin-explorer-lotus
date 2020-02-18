const fs = require('fs')
const path = require('path')

const shadersSrc = path.join(__dirname, '../shaders')
const outFolder = path.join(__dirname, '../shaders/out')

fs.readdir(shadersSrc, function(err, files) {
  const filesWithoutDists = files.filter((file) => /\./.test(file))

  filesWithoutDists.forEach(function(file) {
    let glslStr = fs.readFileSync(shadersSrc + '/' + file, 'utf-8')
    let jsStr = 'module.exports = `' + glslStr + '`;'

    fs.writeFileSync(outFolder + '/' + file + '.js', jsStr, 'utf-8')
  })
})
