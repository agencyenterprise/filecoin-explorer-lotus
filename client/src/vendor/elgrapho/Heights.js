let Heights = function() {
  this.heights = []
}

Heights.prototype = {
  clear: function() {
    this.heightsAdded = []
  },
  addLabel: function(str, x, y) {
    // TODO: add logic to filter out overlapped labels
    this.heightsAdded.push({
      str: str,
      x: x,
      y: y,
      width: 100,
      height: 10,
    })
  },
}

module.exports = Heights
