import React, { useState, useEffect } from 'react'
import { RangeInputs } from './range-inputs.styled'

const RangeInputsComponent = ({ rangeIntervals, onChange }) => {
  const [min, setMin] = useState(rangeIntervals[0])
  const [max, setMax] = useState(rangeIntervals[1])

  useEffect(() => {
    setMin(rangeIntervals[0])
    setMax(rangeIntervals[1])

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, rangeIntervals)

  const onKeyPress = (e) => {
    if (e.which === 13) {
      onSubmit()
    }
  }

  const onSubmit = () => {
    if (min === rangeIntervals[0] && max === rangeIntervals[1]) return

    onChange([Number(min), Number(max)])
  }

  return (
    <RangeInputs>
      <div>
        <input value={min} onKeyPress={onKeyPress} onBlur={onSubmit} onChange={(e) => setMin(e.target.value)} />
        <span>Min</span>
      </div>
      <div>
        <input value={max} onKeyPress={onKeyPress} onBlur={onSubmit} onChange={(e) => setMax(e.target.value)} />
        <span>Max</span>
      </div>
    </RangeInputs>
  )
}

export { RangeInputsComponent as RangeInputs }
