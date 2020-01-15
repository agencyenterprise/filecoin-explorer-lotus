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
  };

  updateBlockHeightFilter = async blockRange => {
    console.log(blockRange);
    this.setState({ blockRange });
  };

  render() {
    const { blockRange } = this.state;

    return (
      <div id="main" style={{ padding: 20 }}>
        <Controls 
          blockRange={blockRange} 
          debouncedUpdateBlockHeightFilter={debounce(this.updateBlockHeightFilter, 500)}
        />
        <Charts blockRange={blockRange} />
        {/* <div id="message" style={{ display: "none" }}></div> */}
      </div>
    );
  }
}

export default withRouter(ChainPage);
