export const scroll = {
  timer: null,

  stop: function() {
    clearTimeout(this.timer)
  },

  scrollTo: function(targetNode, container) {
    const target = targetNode.offsetTop

    const difference = targetNode.offsetTop - container.scrollTop
    const scrollStep = difference / 35
    const positiveDifference = difference > 0

    if (this.timer) {
      clearInterval(this.timer)
    }

    let lastIteration = Number.NEGATIVE_INFINITY

    function step() {
      let yScroll

      let currentPosition = container.scrollTop

      if ((positiveDifference && currentPosition >= target) || (!positiveDifference && currentPosition <= target)) {
        clearTimeout(this.timer)

        return
      }

      let currentScrollStep = scrollStep

      if (positiveDifference && target - currentPosition < scrollStep) {
        currentScrollStep = target - currentPosition
      } else if (!positiveDifference && target - currentPosition > scrollStep) {
        currentScrollStep = target - currentPosition
      }

      yScroll = container.scrollTop + currentScrollStep
      container.scrollTo(0, yScroll)

      if (yScroll === lastIteration) return

      lastIteration = yScroll
      this.timer = setTimeout(step, 10)
    }

    this.timer = setTimeout(step, 10)
  },
}
