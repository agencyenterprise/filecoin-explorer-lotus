const zoomInIcon = require('../../icons/out/zoomInIcon.svg')
const zoomOutIcon = require('../../icons/out/zoomOutIcon.svg')
const moveIcon = require('../../icons/out/moveIcon.svg')
const selectIcon = require('../../icons/out/selectIcon.svg')
const boxZoomIcon = require('../../icons/out/boxZoomIcon.svg')
// const resetIcon = require('../../icons/out/resetIcon.svg')

const Controls = function(config) {
  this.graph = config.graph
  this.container = config.container
  this.wrapper = document.createElement('div')
  this.wrapper.className = 'el-grapho-controls'

  this.container.appendChild(this.wrapper)

  this.selectButton = this.addButton({
    icon: selectIcon,
    evtName: 'select',
  })
  this.boxZoomIcon = this.addButton({
    icon: boxZoomIcon,
    evtName: 'box-zoom',
  })
  this.panButton = this.addButton({
    icon: moveIcon,
    evtName: 'pan',
  })
  // this.resetButton = this.addButton({
  //   icon: resetIcon,
  //   evtName: 'reset',
  // })
  this.zoomInButton = this.addButton({
    icon: zoomInIcon,
    evtName: 'zoom-in',
  })
  this.zoomOutButton = this.addButton({
    icon: zoomOutIcon,
    evtName: 'zoom-out',
  })
}

Controls.prototype = {
  addButton: function(config) {
    let button = document.createElement('button')
    button.className = 'el-grapho-' + config.evtName + '-control'
    let graph = this.graph

    button.innerHTML = config.icon

    button.addEventListener('click', function() {
      graph.fire(config.evtName)
    })

    this.wrapper.appendChild(button)

    return button
  },
}

module.exports = Controls
