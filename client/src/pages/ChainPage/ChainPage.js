import React from "react";
import {
  withRouter
} from "react-router-dom";
import debounce from "lodash/debounce";
import { Controls } from './Controls';
import { Charts } from './Charts';
import { getBlockRange } from '../../api';
import { maxBlockRange } from '../../utils';

class ChainPage extends React.Component {
  state = {
    blockRange: [],
    minBlock: 0,
    maxBlock: 0,
    startDate: '',
    endDate: '',
    miner: ''
  };

  async componentDidMount() {
    const res = await getBlockRange()
    let blockRange = []
    let minBlock = this.state.minBlock
    let maxBlock = this.state.maxBlock

    if (res && res.minHeight) {
      minBlock = Number(res.minHeight)
    }
    if (res && res.maxHeight) {
      maxBlock = Number(res.maxHeight)
      blockRange = [Math.max(0, maxBlock - maxBlockRange), maxBlock]
    }

    this.setState({ 
      blockRange,
      minBlock,
      maxBlock
    })
  }

  render() {
    const { blockRange, startDate, endDate, miner, minBlock, maxBlock } = this.state;

    return (
      <div id="main" style={{ padding: 20, overflow: 'auto' }}>
        <Controls 
          minBlock={minBlock}
          maxBlock={maxBlock}
          debouncedUpdateBlockHeightFilter={debounce((blockRange) => { this.setState({ blockRange }) }, 500)}
          startDate={startDate}
          endDate={endDate}
          setStartDate={startDate => { this.setState({ startDate }) }}
          setEndDate={endDate => { this.setState({ endDate }) }}
          setMiner={miner => { this.setState({ miner }) }}
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
