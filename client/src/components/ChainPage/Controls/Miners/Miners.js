import React, { useEffect } from 'react'
import { DashedLine } from '../controls.styled'
import { Amount, Data, Miner, Miners, Name, Number, ProgressBar, Txs } from './miners.styled'

const d3 = window.d3

const total = 960
const fakedata = [
  {
    name: 't001',
    color: '#3ED2DC',
    total: 320,
    percentage: Math.round((100 * 320) / total),
  },
  {
    name: 't002',
    color: '#DB5669',
    total: 280,
    percentage: Math.round((100 * 280) / total),
  },
  {
    name: 't003',
    color: '#F5BBBA',
    total: 160,
    percentage: Math.round((100 * 160) / total),
  },
  {
    name: 't004',
    color: '#FDC963',
    total: 100,
    percentage: Math.round((100 * 100) / total),
  },
  {
    name: 't005',
    color: '#FE7763',
    total: 40,
    percentage: Math.round((100 * 40) / total),
  },
  {
    name: 't006',
    color: '#27346A',
    total: 30,
    percentage: Math.round((100 * 30) / total),
  },
  {
    name: 't007',
    color: '#E58E7B',
    total: 30,
    percentage: Math.round((100 * 30) / total),
  },
]

const MinersComponent = () => {
  useEffect(() => {
    const width = 242
    const height = 336

    const svg = d3
      .select('#treemap')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')

    const root = d3.hierarchy({ children: fakedata }).sum((d) => d.total)

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

  return (
    <>
      <div id="treemap" />
      <DashedLine />
      <Miners>
        <div>
          <span>309</span> Miners
        </div>
        <div>
          <span>42</span> Countries
        </div>
      </Miners>
      <DashedLine />
      {fakedata.map((miner) => (
        <Miner>
          <Data>
            <ProgressBar percentage={miner.percentage || 0} color={miner.color} />
            <Name>{miner.name}</Name>
          </Data>
          <Amount>
            <Number>{miner.percentage}%</Number>
            <Txs>of Tx's</Txs>
          </Amount>
        </Miner>
      ))}
    </>
  )
}

export { MinersComponent as Miners }
