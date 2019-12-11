import React from 'react';
import logo from './logo.svg';
import Graph from 'react-graph-vis'
import axios from 'axios'
import './App.css';

class App extends React.Component {
  state = {
    chain: {
      nodes: [],
      edges: []
    }
  }

  constructor() {
    super()
    this.getChain()
  }


  getChain() {
    axios.get('http://localhost:8888/api/chain').then(res => {
      const chain = {
        nodes: [],
        edges: []
      }
      const blocks = {}

      res.data.forEach(block => {
        blocks[block.block] = chain.nodes.length
        chain.nodes.push({
          id: blocks[block.block],
          label: `${block.miner}:${block.height}`,
          title: block.block
        })
        chain.edges.push({
          from: blocks[block.block],
          to: blocks[block.parent]
        })
      })
      this.setState({ chain })
    })
  }

  render() {
    const graph = this.state.chain

    //  || {
    //   nodes: [
    //     { id: 1, label: "Node 1", title: "node 1 tootip text" },
    //     { id: 2, label: "Node 2", title: "node 2 tootip text" },
    //     { id: 3, label: "Node 3", title: "node 3 tootip text" },
    //     { id: 4, label: "Node 4", title: "node 4 tootip text" },
    //     { id: 5, label: "Node 5", title: "node 5 tootip text" }
    //   ],
    //   edges: [
    //     { from: 1, to: 2 },
    //     { from: 1, to: 3 },
    //     { from: 2, to: 4 },
    //     { from: 2, to: 5 },
    //     { from: 4, to: 5 }
    //   ]
    // };

    const options = {
      layout: {
        hierarchical: true
      },
      edges: {
        color: "#000000"
      },
      height: "500px"
    }

    const events = {
      select: function(event) {
        var { nodes, edges } = event;
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
    );
  }
}

export default App;
