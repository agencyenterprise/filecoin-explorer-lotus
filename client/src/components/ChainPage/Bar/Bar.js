import React, { useState, useEffect } from 'react'
import { Bar, Logo, Menu, MenuButton, MenuButtonWrapper, RotatedTextWrapper, SectionText } from './bar.styled'

const BarComponent = () => {
  const [tag, setTag] = useState('')
  const [currentSection, setCurrentSection] = useState('1')
  const [items, setItems] = useState([])

  useEffect(() => {
    const elements = document.querySelectorAll('[data-section]')

    const asItems = []

    elements.forEach((element) => {
      asItems.push({
        element,
        section: element.getAttribute('data-section'),
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
    setCurrentSection(to)
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
              onClick={() => navigate(item.section)}
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
