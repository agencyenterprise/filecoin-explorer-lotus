import React from 'react'
import times from './close.svg'
import { Block, CloseButton, Content, NodeModal, Title, PurpleLink } from './node-modal.styled'

const NodeModalComponent = ({ node, close }) => {
  const data = [
    { title: 'Hash', key: 'id' },
    { title: 'Height', key: 'height' },
    { title: 'Timestamp', key: '' },
    { title: 'Block Size', key: '' },
    { title: 'Messages', key: '' },
    { title: 'Reward', key: '' },
    { title: 'Parent Hash', key: '' },
    { title: 'Parent Weight', key: 'parentWeight' },
    { title: 'Ticket', key: '' },
    { title: 'State Root', key: '' },
  ]

  return (
    <NodeModal>
      <Block aligned spaced>
        <Title>{node.miner}</Title>
        <CloseButton src={times} onClick={close} />
      </Block>
      {data.map((d) => (
        <Block key={d.title}>
          <Title>{d.title}</Title>
          <Content>{node[d.key]}</Content>
        </Block>
      ))}
      <Block aligned borderless hoverable spaced>
        <PurpleLink>View on filscan.io</PurpleLink>
        <PurpleLink>→</PurpleLink>
      </Block>
    </NodeModal>
  )
}

export { NodeModalComponent as NodeModal }
