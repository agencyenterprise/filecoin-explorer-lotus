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
      links: []
    }
  }

  blocks = {}

  constructor() {
    super()
    this.getChain()
  }

  componentDidMount() {
    this.renderGraph()
  }

  getChain() {
    axios.get(`${host}/api/chain`).then(res => {
      const chain = {
        nodes: [],
        links: []
      }
      this.blocks = {}

      res.data.forEach(block => {
        this.blocks[block.block] = chain.nodes.length
        chain.nodes.push({
          id: this.blocks[block.block],
          label: `${block.miner}:${block.height}`,
          title: block.block
        })
        chain.links.push({
          sourcename: this.blocks[block.block],
          targetname: this.blocks[block.parent]
        })
      })
      this.setState({ chain })
    })
  }

  renderGraph() {
    var dc_graph = window.dc_graph;
    var sync_url_options = window.sync_url_options;
    var d3 = window.d3;
    var dcgraph_domain = window.dcgraph_domain;
    var querystring = window.querystring;
    //
    // var growingDiagram = dc_graph.diagram('#graph');
    // var options = {
    //     layout: {
    //         default: 'dot',//'cola',
    //         values: dc_graph.engines.available(),
    //         selector: '#layout',
    //         needs_relayout: true,
    //         exert: function(val, diagram) {
    //             var engine = dc_graph.spawn_engine(val);
    //             apply_engine_parameters(engine);
    //             diagram
    //                 .layoutEngine(engine);
    //         }
    //     },
    //     worker: false,
    //     batch: 1,
    //     newnode: 0.9,
    //     newcomp: 0.1,
    //     remove: 0,
    //     remedge: 0.75,
    //     interval: 500,
    //     opacity: 0.7,
    //     arrows: false,
    //     ports: false,
    //     shape: 'ellipse',
    //     content: 'text',
    //     icon: null
    // };
    // var sync_url = sync_url_options(options, dcgraph_domain(growingDiagram), growingDiagram);
    // function apply_engine_parameters(engine) {
    //     switch(engine.layoutAlgorithm()) {
    //     case 'd3v4-force':
    //         engine
    //             .collisionRadius(25)
    //             .gravityStrength(0.05)
    //             .initialCharge(-500);
    //         break;
    //     case 'd3-force':
    //         engine
    //             .gravityStrength(0.1)
    //             .initialCharge(-1000);
    //     }
    //     return engine;
    // }
    //
    // function build_data(nodes, edges) {
    //     // build crossfilters from scratch
    //     return {
    //         edgef: dc_graph.flat_group.make(edges, function(d) {
    //             return d.id;
    //         }),
    //         nodef: dc_graph.flat_group.make(nodes, function(d) {
    //             return d.id;
    //         })
    //     };
    // }
    //
    // var engine = dc_graph.spawn_engine(sync_url.vals.layout, querystring.parse(), sync_url.vals.worker);
    // apply_engine_parameters(engine);
    // // don't do multiple components for cola unless user specified
    // // layout is that unstable
    // if(engine.layoutAlgorithm()==='cola')
    //     if(typeof sync_url.vals.newcomp !== 'string')
    //         sync_url.vals.newcomp = 0;
    //
    // var random = dc_graph.random_graph({
    //     nodeKey: 'id', edgeKey: 'id',
    //     ncolors: 12,
    //     newNodeProb: sync_url.vals.newnode,
    //     newComponentProb: sync_url.vals.newcomp,
    //     removeEdgeProb: sync_url.vals.remedge,
    //     log: sync_url.vals.log && sync_url.vals.log !== 'false'
    // });
    // var data = build_data(random.nodes(), random.edges());
    // growingDiagram
    //     .layoutEngine(engine)
    //     .width('auto')
    //     .height('auto')
    //     .restrictPan(true)
    //     .zoomExtent([0.1, 1.5])
    //     .nodeDimension(data.nodef.dimension).nodeGroup(data.nodef.group)
    //     .edgeDimension(data.edgef.dimension).edgeGroup(data.edgef.group)
    //     .nodeShape({shape: sync_url.vals.shape})
    //     .nodeContent(sync_url.vals.content)
    //     .nodeIcon(sync_url.vals.icon)
    //     .nodeStrokeWidth(0) // turn off outlines
    //     .nodeLabel(function(kv) { return kv.key; })
    //     .nodeLabelFill(sync_url.vals.shape === 'plain' ? 'black' : function(n) {
    //         var rgb = d3.rgb(growingDiagram.nodeFillScale()(growingDiagram.nodeFill()(n))),
    //             // https://www.w3.org/TR/AERT#color-contrast
    //             brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    //         return brightness > 127 ? 'black' : 'ghostwhite';
    //     })
    //     .nodeFill(function(kv) {
    //         return kv.value.color;
    //     })
    //     .nodeFillScale(d3.scale.ordinal().range(
    //         ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c',
    //          '#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928']))
    //     .nodeOpacity(sync_url.vals.opacity)
    //     .nodeTitle(null) // deactivate basic tooltips
    //     .edgeArrowhead(sync_url.vals.arrows ? 'vee' : null)
    //     .timeLimit(sync_url.vals.interval - 100);
    //
    // if(sync_url.vals.ports) {
    //     growingDiagram
    //         .portStyle('symbols', dc_graph.symbol_port_style())
    //         .portStyleName('symbols');
    // }
    // var fix_nodes = dc_graph.fix_nodes()
    //     .strategy(dc_graph.fix_nodes.strategy.last_N_per_component(1));
    // growingDiagram.child('fix-nodes', fix_nodes);
    //
    // growingDiagram
    //     .render()
    //     .autoZoom('once-noanim');
    //
    // var interval = null;
    // function run() {
    //     interval = window.setInterval(function() {
    //         for(var i = 0; i < sync_url.vals.batch; ++i) {
    //             if(Math.random() < sync_url.vals.remove)
    //                 random.remove(1)
    //             else
    //                 random.generate(1);
    //         }
    //         data = build_data(random.nodes(), random.edges());
    //         growingDiagram
    //             .nodeDimension(data.nodef.dimension).nodeGroup(data.nodef.group)
    //             .edgeDimension(data.edgef.dimension).edgeGroup(data.edgef.group)
    //             .redraw();
    //     }, sync_url.vals.interval);
    // }
    // run();





      var options = {
        layout: {
            default: 'dot',
            values: dc_graph.engines.available(),
            selector: '#layout',
            needs_relayout: true,
            exert: function(val, diagram) {
                var engine = dc_graph.spawn_engine(val);
                apply_engine_parameters(engine);
                diagram
                    .layoutEngine(engine)
                    .autoZoom('once');
            }
        },
        worker: true,
        //file: '/dcgraph/web/data/process.json',
        file: `${host}/api/chain/graph.json`,
        gvattr: {
            default: true,
            selector: '#graphviz-attrs',
            needs_redraw: 'refresh',
            exert: function(val, diagram) {
                if(val)
                    dc_graph.apply_graphviz_accessors(simpleDiagram);
                else {
                    simpleDiagram
                        .nodeFixed(function (n) {
                            return n.value.fixedPos;
                        })
                        .nodeStrokeWidth(0) // turn off outlines
                        .nodeFill(function(kv) {
                            return '#2E54A2';
                        })
                        .nodeLabelPadding({x: 2, y: 0})
                        .nodeLabelFill('white')
                        .edgeArrowhead(sync_url.vals.arrows ? 'vee' : null);
                }
            }
        },
        cutoff: null,
        limit: {
            default: 0.5,
            selector: '#cutoff',
            needs_redraw: true,
            exert: function(val, _, filters) {
                if(filters.cutoff) {
                    d3.select('#cutoff-display').text(val);
                    filters.cutoff.set(val);
                }
            }
        },
        arrows: false,
        tips: true,
        neighbors: true
    };

    var simpleDiagram = dc_graph.diagram('#graph');
    var filters = {};
    var sync_url = sync_url_options(options, dcgraph_domain(simpleDiagram), simpleDiagram, filters);

    function apply_engine_parameters(engine) {
        switch(engine.layoutAlgorithm()) {
        case 'd3v4-force':
            engine
                .collisionRadius(125)
                .gravityStrength(0.05)
                .initialCharge(-500);
            break;
        case 'd3-force':
            engine
                .gravityStrength(0.1)
                .linkDistance('auto')
                .initialCharge(-5000);
            break;
        }
        return engine;
    }

    function display_error(heading, message) {
        d3.select('#message')
            .style('display', null)
            .html('<div><h1>' + heading + '</h1>' +
                  (message ? '<code>' + message + '</code></div>' : ''));
        throw new Error(message);
    }

    function hide_error() {
        d3.select('#message')
            .style('display', 'none');
    }

    d3.select('#user-file').on('change', function() {
        var filename = this.value;
        if(filename) {
            var reader = new FileReader();
            reader.onload = function(e) {
                hide_error();
                dc_graph.load_graph_text(e.target.result, filename, on_load.bind(null, filename));
            };
            reader.readAsText(this.files[0]);
        }
    });

    var url_output = sync_url.output(), more_output;
    sync_url.output(function(params) {
        url_output(params);
        if(more_output)
            more_output(params);
    });

    function on_load(filename, error, data) {
        if(error) {
            var heading = '';
            if(error.status)
                heading = 'Error ' + error.status + ': ';
            heading += 'Could not load file ' + filename;
            display_error(heading, error.message);
        }

        var graph_data = dc_graph.munge_graph(data),
            nodes = graph_data.nodes,
            edges = graph_data.edges,
            sourceattr = graph_data.sourceattr,
            targetattr = graph_data.targetattr,
            nodekeyattr = graph_data.nodekeyattr;

        function update_data_link() {
            d3.select('#data-link')
                .attr('href', sync_url.what_if_url({file: dc_graph.data_url({nodes: nodes, edges: edges})}));
        }
        more_output = update_data_link;
        update_data_link();

        var edge_key = function(d) {
            return d[sourceattr] + '-' + d[targetattr] + (d.par ? ':' + d.par : '');
        };
        var edge_flat = dc_graph.flat_group.make(edges, edge_key),
            node_flat = dc_graph.flat_group.make(nodes, function(d) { return d[nodekeyattr]; }),
            cluster_flat = dc_graph.flat_group.make(data.clusters || [], function(d) { return d.key; });

        var engine = dc_graph.spawn_engine(sync_url.vals.layout, sync_url.vals, sync_url.vals.worker);
        simpleDiagram
            .layoutEngine(engine)
            .timeLimit(5000)
            .width('auto')
            .height('auto')
            .autoZoom('once')
            .restrictPan(true)
            .nodeDimension(node_flat.dimension).nodeGroup(node_flat.group)
            .edgeDimension(edge_flat.dimension).edgeGroup(edge_flat.group)
            .edgeSource(function(e) { return e.value[sourceattr]; })
            .edgeTarget(function(e) { return e.value[targetattr]; })
            .clusterDimension(cluster_flat.dimension).clusterGroup(cluster_flat.group)
            .nodeParentCluster(data.node_cluster ? function(n) { return data.node_cluster[n.key]; } : null)
            .clusterParent(function(c) { return c.parent; })
        // aesthetics
            .nodeTitle(null); // deactivate basic tooltips

        if(sync_url.vals.cutoff) {
            d3.select('#cutoff-stuff').style('display', 'inline-block');
            var dim = edge_flat.crossfilter.dimension(function(d) {
                return +d[sync_url.vals.cutoff];
            });
            filters.cutoff = {
                set: function(v) {
                    dim.filterRange([v, Infinity]);
                }
            };
        }

        var draw_clusters = dc_graph.draw_clusters();
        simpleDiagram.child('draw-clusters', draw_clusters);

        sync_url.exert();

        var move_nodes = dc_graph.move_nodes();
        simpleDiagram.child('move-nodes', move_nodes);

        var fix_nodes = dc_graph.fix_nodes()
            .strategy(dc_graph.fix_nodes.strategy.last_N_per_component(Infinity));
        simpleDiagram.child('fix-nodes', fix_nodes);

        if(sync_url.vals.tips) {
            var tip = dc_graph.tip();
            var json_table = dc_graph.tip.html_or_json_table()
                .json(function(d) {
                    return (d.orig.value.value || d.orig.value).jsontip || JSON.stringify(d.orig.value);
                });
            tip
                .showDelay(250)
                .content(json_table);
            simpleDiagram.child('tip', tip);
        }
        if(sync_url.vals.neighbors) {
            var highlight_neighbors = dc_graph.highlight_neighbors({
                edgeStroke: 'orangered',
                edgeStrokeWidth: 3
            }).durationOverride(0);
            simpleDiagram
                .child('highlight-neighbors', highlight_neighbors);
        }

        simpleDiagram.render();
    }

    dc_graph.load_graph(sync_url.vals.file, on_load.bind(null, sync_url.vals.file));

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
      <div id="main">
        <div id="graph" class="chart"></div>
        <div id="message" style={{display: 'none'}}></div>
      </div>
    )
  }
}

//
// <Graph
//   graph={graph}
//   options={options}
//   events={events}
//   getNetwork={network => {
//     //  if you want access to vis.js network api you can set the state in a parent component using this property
//   }}
// />

export default withRouter(ChainPage)