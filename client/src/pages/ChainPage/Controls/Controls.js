import React from 'react';
import Slider from "rc-slider";
import DatePicker from "react-datepicker";
import "rc-slider/assets/index.css";
import "react-datepicker/dist/react-datepicker.css";
import { maxBlockRange } from '../../../utils';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

export class Controls extends React.Component {
  state = {
    internalBlockRange: [],
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.maxBlock && this.props.maxBlock !== prevProps.maxBlock) {
      this.setState({
        internalBlockRange: [Math.max(0, this.props.maxBlock - maxBlockRange), this.props.maxBlock]
      })
    }
  }

  render() {
    const { 
      debouncedUpdateBlockHeightFilter,
      startDate,
      endDate,
      setStartDate,
      setEndDate,
      setMiner,
      minBlock,
      maxBlock,
    } = this.props;
    const { internalBlockRange } = this.state;

    return (
      <div id="controls" className="uk-card uk-card-default uk-card-body">
        <h3 className="uk-card-title">Controls</h3>
        <div>
          Block Range
          <Range
            min={minBlock}
            max={maxBlock}
            value={internalBlockRange}
            step={5}
            allowCross={false}
            onChange={newInternalBlockRange => { 
              const { internalBlockRange } = this.state;
              if (internalBlockRange[0] !== newInternalBlockRange[0]) {
                // note: min is moving
                if (newInternalBlockRange[1] - newInternalBlockRange[0] > maxBlockRange) {
                  newInternalBlockRange[1] = newInternalBlockRange[0] + maxBlockRange
                }
              } else {
                // note: max is moving
                if (newInternalBlockRange[1] - newInternalBlockRange[0] > maxBlockRange) {
                  newInternalBlockRange[0] = newInternalBlockRange[1] - maxBlockRange
                }
              }
              this.setState({ internalBlockRange: newInternalBlockRange })
            }}
            onAfterChange={debouncedUpdateBlockHeightFilter}
          />
          <select id="layout"></select>
        </div>
        <label className="uk-search uk-search-default" style={{marginTop: '15px' }}>
          Miner
          <input 
            className="uk-search-input" 
            type="search" 
            placeholder="" 
            onBlur={(e) => { 
              setMiner(e.target.value) 
            }} 
            onKeyPress={e => {
              if (e.key === 'Enter') {
                e.target.blur();
              }
            }}
          />
        </label>
        <div style={{marginTop: '15px' }}>
          <label className="uk-search uk-search-default">
            Start Date
            <DatePicker
              selected={startDate}
              onChange={setStartDate}
              className="uk-search-input" 
            />
          </label>
          <label className="uk-search uk-search-default" style={{ marginLeft: '10px' }}>
            End Date
            <DatePicker
              selected={endDate}
              onChange={setEndDate}
              className="uk-search-input" 
            />
          </label>
        </div>
      </div>
    );
  }
}
