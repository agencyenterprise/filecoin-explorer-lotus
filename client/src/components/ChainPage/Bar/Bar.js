import React, { useContext, useEffect, useState } from 'react'
import { store } from '../../../context/store'
import { Bar, Logo, Menu, MenuButton, MenuButtonWrapper, RotatedTextWrapper, SectionText } from './bar.styled'
import { scroll } from '../../../utils'

const BarComponent = () => {
  const [tag, setTag] = useState('')
  const [items, setItems] = useState([])
  const { state } = useContext(store)
  const { currentSection } = state

  useEffect(() => {
    const elements = document.querySelectorAll('[data-section]')

    const asItems = []

    elements.forEach((element) => {
      asItems.push({
        element,
        section: Number(element.getAttribute('data-section')),
        label: element.getAttribute('data-label'),
      })
    })

    setItems(asItems)
  }, [])

  const onMouseEnter = (label) => {
    setTag(label)
  }

  const onMouseLeave = () => {
    setTag('')
  }

  const navigate = (to) => {
    const controlsDiv = document.getElementById('controls')

    scroll.scrollTo(to.element, controlsDiv)
  }

  return (
    <Bar>
      <div>
        <Menu>
          {items.map((item) => (
            <MenuButtonWrapper
              key={item.section}
              onMouseEnter={() => onMouseEnter(item.label)}
              onMouseLeave={onMouseLeave}
              onClick={() => navigate(item)}
            >
              <MenuButton active={item.section === currentSection}>{item.section}</MenuButton>
            </MenuButtonWrapper>
          ))}
        </Menu>
        <RotatedTextWrapper>
          <SectionText>{tag}</SectionText>
        </RotatedTextWrapper>
      </div>
      <RotatedTextWrapper>
        <Logo>Filecoin Blockchain explorer</Logo>
      </RotatedTextWrapper>
    </Bar>
  )
}

export { BarComponent as Bar }
