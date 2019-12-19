import React from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter
} from "react-router-dom";
import "./App.css";

const host =
  window.location.hostname == "localhost" ? "http://localhost:8888" : "";

class ChainPage extends React.Component {
  state = {
    chain: {
      nodes: [],
      links: []
    }
  };

  async componentDidMount() {
    await this.getChain();
    this.renderGraph();
  }
  minerToRGB(miner) {
    // ignore network prefix and protocol, should be simple id
    const str = miner.substr(2);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var color = "#";
    for (var i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 0xff;
      color += ("00" + value.toString(16)).substr(-2);
    }
    return color;
  }

  async getChain() {
    const res = await axios.get(`${host}/api/chain`);
    const chain = {
      nodes: [],
      edges: []
    };
    const blocks = {};

    res.data.forEach(block => {
      blocks[block.block] = chain.nodes.length;
      chain.nodes.push({
        id: blocks[block.block],
        key: blocks[block.block].toString(),
        height: block.height,
        miner: block.miner,
        color: this.minerToRGB(block.miner)
        //name: blocks[block.block],
        //title: block.block
      });
      chain.edges.push({
        sourcename: blocks[block.block],
        targetname: blocks[block.parent],
        key: `${blocks[block.block]}-e`,
        dash: 1
      });
    });
    this.setState({ chain });
  }

  renderGraph() {
    console.log("render graph");
    var dc_graph = window.dc_graph;
    var dc = window.dc;
    var sync_url_options = window.sync_url_options;
    var d3 = window.d3;
    var dcgraph_domain = window.dcgraph_domain;
    var querystring = window.querystring;

    var selectionDiagram = dc_graph.diagram("#graph"),
      pie,
      row;

    var options = {
      layout: {
        default: "dagre",
        values: dc_graph.engines.available(),
        selector: "#layout",
        needs_relayout: true,
        exert: function(val, diagram) {
          var engine = dc_graph.spawn_engine(val);
          apply_engine_parameters(engine);
          diagram.layoutEngine(engine).autoZoom("once");
        }
      },
      worker: {
        default: false
      },
      n: {
        default: 100,
        values: [1, 5, 10, 20, 50, 100, 200],
        selector: "#number",
        needs_redraw: true,
        exert: function(val, diagram) {
          populate(val);
          diagram.autoZoom("once");
        }
      },
      transition_duration: {
        query: "tdur",
        default: 1000
      },
      arrows: {
        default: "none"
      }
    };
    var sync_url = sync_url_options(
      options,
      dcgraph_domain(selectionDiagram),
      selectionDiagram
    );

    function apply_engine_parameters(engine) {
      switch (engine.layoutAlgorithm()) {
        case "d3v4-force":
          engine
            .collisionRadius(25)
            .gravityStrength(0.05)
            .initialCharge(-500);
          break;
        case "d3-force":
          engine.gravityStrength(0.1).initialCharge(-1000);
          break;
      }
      selectionDiagram.initLayoutOnRedraw(engine.layoutAlgorithm() === "cola");
      return engine;
    }
    function build_data(nodes, edges) {
      // build crossfilters from scratch
      return {
        edgef: dc_graph.flat_group.make(edges, function(d) {
          return d.key;
        }),
        nodef: dc_graph.flat_group.make(nodes, function(d) {
          return d.key;
        })
      };
    }

    var populate = function(n) {
      console.log(this.state.chain.nodes);
      var data = build_data(this.state.chain.nodes, this.state.chain.edges),
        colorDimension = data.nodef.crossfilter.dimension(function(n) {
          return n.color;
        }),
        colorGroup = colorDimension.group(),
        dashDimension = data.edgef.crossfilter.dimension(function(e) {
          return e.dash;
        }),
        dashGroup = dashDimension.group();
      selectionDiagram
        .nodeDimension(data.nodef.dimension)
        .nodeGroup(data.nodef.group)
        .edgeDimension(data.edgef.dimension)
        .edgeGroup(data.edgef.group);
      pie.dimension(colorDimension).group(colorGroup);
      row.dimension(dashDimension).group(dashGroup);
    }.bind(this);
    var engine = dc_graph.spawn_engine(
      sync_url.vals.layout,
      querystring.parse(),
      sync_url.vals.worker
    );
    apply_engine_parameters(engine);
    // maximally distinct colors from: https://graphicdesign.stackexchange.com/revisions/3815/8
    // prettier-ignore
    var colors = ["#000000","#FFFF00","#1CE6FF","#FF34FF","#FF4A46","#008941","#006FA6","#A30059","#FFDBE5","#7A4900","#0000A6","#63FFAC","#B79762","#004D43","#8FB0FF","#997D87","#5A0007","#809693","#FEFFE6","#1B4400","#4FC601","#3B5DFF","#4A3B53","#FF2F80","#61615A","#BA0900","#6B7900","#00C2A0","#FFAA92","#FF90C9","#B903AA","#D16100","#DDEFFF","#000035","#7B4F4B","#A1C299","#300018","#0AA6D8","#013349","#00846F","#372101","#FFB500","#C2FFED","#A079BF","#CC0744","#C0B9B2","#C2FF99","#001E09","#00489C","#6F0062","#0CBD66","#EEC3FF","#456D75","#B77B68","#7A87A1","#788D66","#885578","#FAD09F","#FF8A9A","#D157A0","#BEC459","#456648","#0086ED","#886F4C","#34362D","#B4A8BD","#00A6AA","#452C2C","#636375","#A3C8C9","#FF913F","#938A81","#575329","#00FECF","#B05B6F","#8CD0FF","#3B9700","#04F757","#C8A1A1","#1E6E00","#7900D7","#A77500","#6367A9","#A05837","#6B002C","#772600","#D790FF","#9B9700","#549E79","#FFF69F","#201625","#72418F","#BC23FF","#99ADC0","#3A2465","#922329","#5B4534","#FDE8DC","#404E55","#0089A3","#CB7E98","#A4E804","#324E72","#6A3A4C","#83AB58","#001C1E","#D1F7CE","#004B28","#C8D0F6","#A3A489","#806C66","#222800","#BF5650","#E83000","#66796D","#DA007C","#FF1A59","#8ADBB4","#1E0200","#5B4E51","#C895C5","#320033","#FF6832","#66E1D3","#CFCDAC","#D0AC94","#7ED379","#012C58","#7A7BFF","#D68E01","#353339","#78AFA1","#FEB2C6","#75797C","#837393","#943A4D","#B5F4FF","#D2DCD5","#9556BD","#6A714A","#001325","#02525F","#0AA3F7","#E98176","#DBD5DD","#5EBCD1","#3D4F44","#7E6405","#02684E","#962B75","#8D8546","#9695C5","#E773CE","#D86A78","#3E89BE","#CA834E","#518A87","#5B113C","#55813B","#E704C4","#00005F","#A97399","#4B8160","#59738A","#FF5DA7","#F7C9BF","#643127","#513A01","#6B94AA","#51A058","#A45B02","#1D1702","#E20027","#E7AB63","#4C6001","#9C6966","#64547B","#97979E","#006A66","#391406","#F4D749","#0045D2","#006C31","#DDB6D0","#7C6571","#9FB2A4","#00D891","#15A08A","#BC65E9","#FFFFFE","#C6DC99","#203B3C","#671190","#6B3A64","#F5E1FF","#FFA0F2","#CCAA35","#374527","#8BB400","#797868","#C6005A","#3B000A","#C86240","#29607C","#402334","#7D5A44","#CCB87C","#B88183","#AA5199","#B5D6C3","#A38469","#9F94F0","#A74571","#B894A6","#71BB8C","#00B433","#789EC9","#6D80BA","#953F00","#5EFF03","#E4FFFC","#1BE177","#BCB1E5","#76912F","#003109","#0060CD","#D20096","#895563","#29201D","#5B3213","#A76F42","#89412E","#1A3A2A","#494B5A","#A88C85","#F4ABAA","#A3F3AB","#00C6C8","#EA8B66","#958A9F","#BDC9D2","#9FA064","#BE4700","#658188","#83A485","#453C23","#47675D","#3A3F00","#061203","#DFFB71","#868E7E","#98D058","#6C8F7D","#D7BFC2","#3C3E6E","#D83D66","#2F5D9B","#6C5E46","#D25B88","#5B656C","#00B57F","#545C46","#866097","#365D25","#252F99","#00CCFF","#674E60","#FC009C","#92896B"];
    var dasheses = [
      { name: "solid", ray: null },
      { name: "dash", ray: [5, 5] },
      { name: "dot", ray: [1, 5] },
      { name: "dot-dash", ray: [15, 10, 5, 10] }
    ];
    selectionDiagram
      .layoutEngine(engine)
      .timeLimit(5000)
      .transitionDuration(sync_url.vals.transition_duration)
      .fitStrategy("horizontal")
      .restrictPan(true)
      .margins({ top: 5, left: 5, right: 5, bottom: 5 })
      .autoZoom("once-noanim")
      .zoomDuration(sync_url.vals.transition_duration)
      .altKeyZoom(true)
      .width("auto")
      .height("auto")
      .nodeFixed(function(n) {
        return n.value.fixed;
      })
      .nodeStrokeWidth(0) // turn off outlines
      .nodeLabel(function(n) {
        return n.value.height;
      })
      .nodeLabelFill(function(n) {
        var rgb = d3.rgb(
            selectionDiagram.nodeFillScale()(selectionDiagram.nodeFill()(n))
          ),
          // https://www.w3.org/TR/AERT#color-contrast
          brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        return brightness > 127 ? "black" : "ghostwhite";
      })
      .nodeFill(function(kv) {
        return kv.value.color;
      })
      .nodeOpacity(0.25)
      .edgeOpacity(0.25)
      .timeLimit(1000)
      .nodeFillScale(
        d3.scale
          .ordinal()
          .domain([0, 1, 2])
          .range(colors)
      )
      .nodeTitle(dc.pluck("key"))
      .edgeStrokeDashArray(function(e) {
        return dasheses[e.value.dash].ray;
      })
      .edgeArrowhead(
        sync_url.vals.arrows === "head" || sync_url.vals.arrows === "both"
          ? "vee"
          : null
      )
      .edgeArrowtail(
        sync_url.vals.arrows === "tail" || sync_url.vals.arrows === "both"
          ? "crow"
          : null
      );

    selectionDiagram.child(
      "select-nodes",
      dc_graph
        .select_nodes({
          nodeOpacity: 1
        })
        .noneIsAll(true)
        .autoCropSelection(false)
    );
    selectionDiagram.child(
      "filter-selection-nodes",
      dc_graph.filter_selection("select-nodes-group", "select-nodes")
    );

    selectionDiagram.child("move-nodes", dc_graph.move_nodes());

    selectionDiagram.child(
      "fix-nodes",
      dc_graph.fix_nodes({
        fixedPosTag: "fixed"
      })
    );

    selectionDiagram.child(
      "select-edges",
      dc_graph
        .select_edges({
          edgeStrokeWidth: 2,
          edgeOpacity: 1
        })
        .noneIsAll(true)
        .autoCropSelection(false)
    );
    selectionDiagram.child(
      "filter-selection-edges",
      dc_graph
        .filter_selection("select-edges-group", "select-edges")
        .dimensionAccessor(function(c) {
          return c.edgeDimension();
        })
    );

    pie = dc
      .pieChart("#pie")
      .width(150)
      .height(150)
      .radius(75)
      .colors(
        d3.scale
          .ordinal()
          .domain([0, 1, 2])
          .range(colors)
      )
      .label(function() {
        return "";
      })
      .title(function(kv) {
        return colors[kv.key] + " nodes (" + kv.value + ")";
      });

    row = dc
      .rowChart("#row")
      .width(300)
      .height(150)
      .label(function(kv) {
        return dasheses[kv.key].name;
      });

    populate(sync_url.vals.n);

    dc.renderAll();
  }
  render() {
    return (
      <div id="main" style={{ padding: 20 }}>
        <div id="graph" className="chart"></div>
        <div id="message" style={{ display: "none" }}></div>
      </div>
    );
  }
}

export default withRouter(ChainPage);
