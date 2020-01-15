import React from 'react';
import Slider from "rc-slider";
import DatePicker from "react-datepicker";
import "rc-slider/assets/index.css";
import "react-datepicker/dist/react-datepicker.css";

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

export class Controls extends React.Component {
  state = {
    internalBlockRange: [0, 13840],
  };

  render() {
    const { 
      blockRange, 
      debouncedUpdateBlockHeightFilter,
      startDate,
      endDate,
      setStartDate,
      setEndDate,
      setMiner
    } = this.props;
    const { internalBlockRange } = this.state;

    return (
      <div id="controls" className="uk-card uk-card-default uk-card-body">
        <h3 className="uk-card-title">Controls</h3>
        <div>
          Block Range
          <Range
            min={0}
            max={13840}
            value={internalBlockRange}
            step={5}
            allowCross={false}
            onChange={internalBlockRange => { this.setState({ internalBlockRange })}}
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
