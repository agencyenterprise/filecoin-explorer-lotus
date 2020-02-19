import React, { useContext, useEffect } from 'react'
import { store } from '../../../../context/store'
import { DashedLine } from '../controls.styled'
import { Amount, Data, Miner, Miners, Name, Number, ProgressBar, Txs } from './miners.styled'

const d3 = window.d3

const MinersComponent = () => {
  const {
    state: { chain },
  } = useContext(store)

  useEffect(() => {
    console.log(chain.miners)

    drawGraph()
  }, [chain.miners])

  const drawGraph = () => {
    const width = 242
    const height = 336

    // clear previous graphs
    const treeMapNode = document.querySelector('#treemap')
    while (treeMapNode.firstChild) {
      treeMapNode.removeChild(treeMapNode.lastChild)
    }

    const svg = d3
      .select('#treemap')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')

    const root = d3.hierarchy({ children: chain.miners }).sum((d) => d.total)

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
  }

  const miners = (chain && chain.miners) || []

  return (
    <>
      <div id="treemap" />
      <DashedLine />
      <Miners>
        <div>
          <span>{miners.length}</span> Miners
        </div>
        <div>
          <span>?</span> Countries
        </div>
      </Miners>
      <DashedLine />
      {miners.map((miner) => (
        <Miner key={miner.name}>
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
