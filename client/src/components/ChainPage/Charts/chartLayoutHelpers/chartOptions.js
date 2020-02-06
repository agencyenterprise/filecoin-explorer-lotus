export const chartOptions = {
  layout: {
    default: 'dagre',
  },
  worker: {
    default: false,
  },
  n: {
    default: 100,
    values: [1, 5, 10, 20, 50, 100, 200],
    selector: '#number',
    needs_redraw: true,
    exert: (val, diagram) => {
      this.populate(val)
      diagram.autoZoom('once')
    },
  },
  transition_duration: {
    query: 'tdur',
    default: 1000,
  },
  arrows: {
    default: 'none',
  },
}
