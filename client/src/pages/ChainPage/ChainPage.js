import React from "react";
import {
  withRouter
} from "react-router-dom";
import debounce from "lodash/debounce";
import { Controls } from './Controls';
import { Charts } from './Charts';

class ChainPage extends React.Component {
  state = {
    blockRange: [0, 13840],
    startDate: '',
    endDate: '',
    miner: ''
  };

  updateBlockHeightFilter = async blockRange => {
    console.log(blockRange);
    this.setState({ blockRange });
  };

  render() {
    const { blockRange, startDate, endDate, miner } = this.state;

    return (
      <div id="main" style={{ padding: 20, overflow: 'auto' }}>
        <Controls 
          blockRange={blockRange} 
          debouncedUpdateBlockHeightFilter={debounce(this.updateBlockHeightFilter, 500)}
          startDate={startDate}
          endDate={endDate}
          setStartDate={startDate => { console.log('setting start date');this.setState({ startDate }) }}
          setEndDate={endDate => { console.log('setting end date');this.setState({ endDate }) }}
          setMiner={miner => { console.log('setting miner');this.setState({ miner }) }}
        />
        <Charts 
          blockRange={blockRange} 
          startDate={startDate}
          endDate={endDate}
          miner={miner}
        />
        {/* <div id="message" style={{ display: "none" }}></div> */}
      </div>
    );
  }
}

export default withRouter(ChainPage);
