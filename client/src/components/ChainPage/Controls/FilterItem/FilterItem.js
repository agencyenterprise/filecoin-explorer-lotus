import React from 'react'
import { SliderCheckbox } from './filter-item.styled'

const FilterItemComponent = ({ label, checked, onChange, value }) => (
  <SliderCheckbox>
    <input type="checkbox" id={value} checked={checked} onChange={onChange} />
    <label htmlFor={value}>{label}</label>
    <span>{checked ? 'On' : 'Off'}</span>
  </SliderCheckbox>
)

export { FilterItemComponent as FilterItem }
