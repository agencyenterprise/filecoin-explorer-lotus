import React from 'react';
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

export class Controls extends React.Component {
  state = {};

  render() {
    const { blockRange, debouncedUpdateBlockHeightFilter } = this.props;
    return (
      <div id="controls">
        <div>Block Range</div>
        <Range
          min={blockRange[0]}
          max={blockRange[1]}
          value={blockRange}
          step={5}
          allowCross={false}
          onChange={debouncedUpdateBlockHeightFilter}
        />
        <select id="layout"></select>
      </div>
    );
  }
}
