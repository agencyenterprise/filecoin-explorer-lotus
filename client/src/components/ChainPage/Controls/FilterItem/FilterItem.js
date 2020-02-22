import React from 'react'
import { Indicator, SliderCheckbox } from './filter-item.styled'

const FilterItemComponent = ({ label, checked, onChange, value }) => (
  <SliderCheckbox>
    <input disabled type="checkbox" id={value} checked={checked} onChange={onChange} />
    <label htmlFor={value}>{label}</label>
    <Indicator active={checked}>{checked ? 'On' : 'Off'}</Indicator>
  </SliderCheckbox>
)

export { FilterItemComponent as FilterItem }
