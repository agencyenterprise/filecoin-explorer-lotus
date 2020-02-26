import React from 'react'
import times from './close.svg'
import { Block, CloseButton, Content, NodeModal, Title, PurpleLink } from './node-modal.styled'
import { DateTime } from 'luxon'

const NodeModalComponent = ({ node, close }) => {
  const timestamp = DateTime.fromSeconds(Number(node.timestamp)).toLocaleString(DateTime.DATETIME_MED)

  const data = [
    { title: 'Hash', key: 'id' },
    { title: 'Height', key: 'height' },
    { title: 'Timestamp', value: timestamp },
    { title: 'Block Size', key: '' },
    { title: 'Messages', key: 'messages' },
    { title: 'Reward', key: '' },
    { title: 'Parent Hash', key: '' },
    { title: 'Parent Weight', key: 'parentWeight' },
    { title: 'Ticket', key: '' },
    { title: 'State Root', key: '' },
  ]

  const openFilscan = () => {
    const link = ` https://filscan.io/#/tipset?hash=${node.id}`

    window.open(link)
  }

  return (
    <NodeModal>
      <Block aligned spaced>
        <Title>{node.miner}</Title>
        <CloseButton src={times} onClick={close} />
      </Block>
      {data.map((d) => {
        const value = d.value || node[d.key]

        if (!value) return <React.Fragment key={d.title} />

        return (
          <Block key={d.title}>
            <Title>{d.title}</Title>
            <Content>{d.value || node[d.key]}</Content>
          </Block>
        )
      })}
      <Block aligned borderless hoverable spaced onClick={openFilscan}>
        <PurpleLink>View on filscan.io</PurpleLink>
        <PurpleLink>→</PurpleLink>
      </Block>
    </NodeModal>
  )
}

export { NodeModalComponent as NodeModal }
