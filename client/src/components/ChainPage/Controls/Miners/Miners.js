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
    drawGraph()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain.miners])

  const selectMiner = (miner) => {
    window.dispatchEvent(new CustomEvent('select-miners', { detail: miner }))
  }

  const isTooSmall = ({ x1, y1, x0, y0 }) => {
    const rectWidth = x1 - x0
    const rectHeight = y1 - y0

    if (rectWidth < 60 || rectHeight < 30) return true

    return false
  }

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
      .attr('class', 'rect-hoverable')

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
      .on('click', (d) => selectMiner(d.data.name))
      .attr('x', (d) => d.x0)
      .attr('y', (d) => d.y0)
      .attr('width', (d) => d.x1 - d.x0 + 2)
      .attr('height', (d) => d.y1 - d.y0 + 2)
      .style('fill', (d) => d.data.color)
      .on('mouseover', function(d) {
        if (isTooSmall(d)) {
          div
            .transition()
            .duration(200)
            .style('opacity', 0.9)
          div
            .html(d.data.name)
            .style('left', d3.event.pageX + 'px')
            .style('top', d3.event.pageY + 'px')
        }
      })
      .on('mouseout', function(d) {
        div
          .transition()
          .duration(500)
          .style('opacity', 0)
      })

    // Define the div for the tooltip
    var div = d3.select('.d3-tooltip').style('opacity', 0)

    svg
      .selectAll('text')
      .data(root.leaves())
      .enter()
      .append('text')
      .attr('x', (d) => d.x0 + 10)
      .attr('y', (d) => d.y0 + 25)
      .text((d) => {
        if (isTooSmall(d)) return ''

        return d.data.name
      })
      .attr('font-size', '12px')
      .attr('font-weight', '500')
      .attr('fill', (d) => d.data.fontColor)
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
