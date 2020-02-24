const EasingFunctions = require('./EasingFunctions')
const styles = require('./styles.scss')
const Enums = require('./Enums')

let ElGraphoCollection = {
  graphs: [],
  initialized: false,
  init: function() {
    ElGraphoCollection.injectStyles()
    ElGraphoCollection.executeFrame()
    ElGraphoCollection.initialized = true
  },
  injectStyles: function() {
    let head = document.getElementsByTagName('head')[0]
    let s = document.createElement('style')
    s.setAttribute('type', 'text/css')
    if (s.styleSheet) {
      // IE
      s.styleSheet.cssText = styles
    } else {
      // the world
      s.appendChild(document.createTextNode(styles))
    }
    head.appendChild(s)
  },
  executeFrame: function() {
    let now = new Date().getTime()
    ElGraphoCollection.graphs.forEach(function(graph) {
      let n = 0
      let idle = true

      // update properties from animations
      while (n < graph.animations.length) {
        let anim = graph.animations[n]

        // if animation is running
        if (now <= anim.endTime) {
          let t = (now - anim.startTime) / (anim.endTime - anim.startTime)
          let valDiff = anim.endVal - anim.startVal

          graph[anim.prop] = anim.startVal + EasingFunctions.easeInOutCubic(t) * valDiff
          n++
        }
        // if animation still exists, but we are now past the endTime, set to final end val and destroy animation
        else {
          graph[anim.prop] = anim.endVal
          graph.animations.splice(n, 1)
          graph.hitDirty = true
        }
        graph.dirty = true
        graph.hoveredDataIndex = -1
        graph.hoverDirty = true
      }

      let magicZoom
      let nodeSize

      let zoom = Math.min(graph.zoomX, graph.zoomY)

      if (graph.nodeSize * zoom >= 1) {
        magicZoom = true
        nodeSize = 1
      } else {
        magicZoom = false
        nodeSize = graph.nodeSize
      }

      if (graph.fillContainer) {
        let containerRect = graph.container.getBoundingClientRect()
        let width = containerRect.width
        let height = containerRect.height

        if (graph.width !== width || graph.height !== height) {
          graph.setSize(width, height)
        }
      }

      let scale = graph.zoomX < 1 || graph.zoomY < 1 ? Math.min(graph.zoomX, graph.zoomY) : 1

      if (graph.hoverDirty) {
        graph.hoverLayer.scene.clear()

        graph.renderRings(scale)
      }

      if (graph.dirty) {
        idle = false
        let focusedGroup = graph.focusedGroup
        let glowBlend = graph.glowBlend

        graph.webgl.drawScene(
          graph.width,
          graph.height,
          graph.panX,
          graph.panY,
          graph.zoomX,
          graph.zoomY,
          magicZoom,
          nodeSize,
          focusedGroup,
          graph.hoveredDataIndex,
          graph.edgeSize,
          graph.darkMode,
          glowBlend,
          graph.nodeOutline,
        )

        graph.labelsLayer.scene.clear()
        graph.rulerLayer.scene.clear()

        if (graph.hasLabels) {
          graph.renderLabels(scale)
        }

        if (graph.model.showRuler) {
          graph.renderRuler(scale)
        }
      }

      if (graph.dirty || graph.hoverDirty) {
        graph.viewport.render() // render composite
      }

      if (graph.hitDirty) {
        idle = false
        graph.webgl.drawHit(
          graph.width,
          graph.height,
          graph.panX,
          graph.panY,
          graph.zoomX,
          graph.zoomY,
          magicZoom,
          nodeSize,
        )
        graph.hitDirty = false
      }

      graph.dirty = false
      graph.hoverDirty = false
      graph.hitDirty = false

      if (idle && !graph.idle) {
        graph.fire(Enums.events.IDLE)
      }

      graph.idle = idle
    })

    requestAnimationFrame(ElGraphoCollection.executeFrame)
  },
  remove: function(graph) {
    let graphs = ElGraphoCollection.graphs
    let len = graphs.length
    for (let n = 0; n < len; n++) {
      if (graphs[n].id === graph.id) {
        graphs.splice(n, 1)
        // return true if element found and removed
        return true
      }
    }

    // return false if nothing was removed
    return false
  },
}

module.exports = ElGraphoCollection
