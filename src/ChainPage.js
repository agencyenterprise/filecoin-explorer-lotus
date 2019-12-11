import React from 'react';
import Graph from 'react-graph-vis'
import axios from 'axios'
import { BrowserRouter as Router, Route, Switch, withRouter } from 'react-router-dom'
import './App.css'

const host = window.location.hostname == 'localhost' ? 'http://localhost:8888' : ''

class ChainPage extends React.Component {
  state = {
    chain: {
      nodes: [],
      edges: []
    }
  }

  blocks = {}

  constructor() {
    super()
    this.getChain()
  }


  getChain() {
    axios.get(`${host}/api/chain`).then(res => {
      const chain = {
        nodes: [],
        edges: []
      }
      this.blocks = {}

      res.data.forEach(block => {
        this.blocks[block.block] = chain.nodes.length
        chain.nodes.push({
          id: this.blocks[block.block],
          label: `${block.miner}:${block.height}`,
          title: block.block
        })
        chain.edges.push({
          from: this.blocks[block.block],
          to: this.blocks[block.parent]
        })
      })
      this.setState({ chain })
    })
  }

  render() {
    const graph = this.state.chain
    const { history } = this.props
    const blocks = this.blocks

    // const graph = {
    //   nodes: [
    //     { id: 1, label: "Node 1", title: "node 1 tootip text" },
    //     { id: 2, label: "Node 2", title: "node 2 tootip text" },
    //
    //     { id: 3, label: "Node 3", title: "node 3 tootip text" },
    //     { id: 4, label: "Node 4", title: "node 4 tootip text" },
    //
    //     { id: 5, label: "Node 5", title: "node 5 tootip text" },
    //     { id: 6, label: "Node 6", title: "node 5 tootip text" },
    //
    //     { id: 7, label: "Node 7", title: "node 5 tootip text" }
    //   ],
    //   edges: [
    //     { from: 1, to: 2 },
    //
    //     { from: 2, to: 3 },
    //     { from: 2, to: 4 },
    //
    //     { from: 4, to: 5 },
    //     { from: 3, to: 5 },
    //
    //     { from: 4, to: 6 },
    //     { from: 3, to: 6 },
    //
    //     { from: 5, to: 7 },
    //     { from: 6, to: 7 }
    //   ]
    // };

    const options = {
      layout: {
        hierarchical: {
          sortMethod: 'directed',
          treeSpacing: 100,
          nodeSpacing: 50,
          levelSeparation: 100
        }
      },
      edges: {
        color: '#000000'
      },
      height: `${window.innerHeight}px`
    }

    const events = {
      select: function(event) {
        var { nodes, edges } = event
        let block
        console.log(nodes[0])
        console.log(blocks)

        for (const key in blocks) {
          if (blocks[key] === nodes[0]) {
            block = key
          }
        }
        if (!block) {
          return
        }
        history.push(`/block/${block}`)
        //window.location.href = `/block/${block}`
      }
    }

    return (
      <Graph
        graph={graph}
        options={options}
        events={events}
        getNetwork={network => {
          //  if you want access to vis.js network api you can set the state in a parent component using this property
        }}
      />
    )
  }
}

export default withRouter(ChainPage)