const fs = require('fs')
const path = require('path')

const iconsSrc = path.join(__dirname, '../icons')
const outFolder = path.join(__dirname, '../icons/out')

fs.readdir(iconsSrc, function(err, files) {
  const filesWithoutDists = files.filter((file) => /\./.test(file))

  filesWithoutDists.forEach(function(file) {
    let glslStr = fs.readFileSync(iconsSrc + '/' + file, 'utf-8')
    let jsStr = 'module.exports = `' + glslStr + '`;'

    fs.writeFileSync(outFolder + '/' + file + '.js', jsStr, 'utf-8')
  })
})
