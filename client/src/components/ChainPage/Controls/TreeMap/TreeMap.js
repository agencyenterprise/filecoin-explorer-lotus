import React, { useEffect } from 'react'
import { TreeMap } from './tree-map.styled'

const d3 = window.d3

const TreeMapComponent = () => {
  useEffect(() => {
    const data = {
      children: [
        {
          name: 't001',
          color: '#3ED2DC',
          total: 320,
        },
        {
          name: 't002',
          color: '#DB5669',
          total: 280,
        },
        {
          name: 't003',
          color: '#F5BBBA',
          total: 160,
        },
        {
          name: 't004',
          color: '#FDC963',
          total: 100,
        },
        {
          name: 't005',
          color: '#FE7763',
          total: 40,
        },
        {
          name: 't006',
          color: '#27346A',
          total: 30,
        },
        {
          name: 't007',
          color: '#E58E7B',
          total: 30,
        },
      ],
    }

    const width = 242
    const height = 336

    const svg = d3
      .select('#treemap')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')

    const root = d3.hierarchy(data).sum((d) => d.total)

    // Then d3.treemap computes the position of each element of the hierarchy
    d3
      .treemap()
      .size([width, height])
      .padding(2)(root)

    svg
      .selectAll('rect')
      .data(root.leaves())
      .enter()
      .append('rect')
      .attr('x', (d) => d.x0)
      .attr('y', (d) => d.y0)
      .attr('width', (d) => d.x1 - d.x0 + 2)
      .attr('height', (d) => d.y1 - d.y0 + 2)
      .style('fill', (d) => d.data.color)

    svg
      .selectAll('text')
      .data(root.leaves())
      .enter()
      .append('text')
      .attr('x', (d) => d.x0 + 10)
      .attr('y', (d) => d.y0 + 25)
      .text((d) => d.data.name)
      .attr('font-size', '12px')
      .attr('font-weight', '500')
      .attr('fill', '#212121')
  }, [])

  return <TreeMap id="treemap" />
}

export { TreeMapComponent as TreeMap }
