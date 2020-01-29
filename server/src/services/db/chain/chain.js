import { db } from '../'

export const getChain = async ({ startBlock, endBlock, startDate, endDate, miner, skip, limit, sortOrder }) => {
  const maxLimit = 500
  let wheres = []
  let whereArgs = []

  if (startBlock) {
    whereArgs.push(Number(startBlock))
    wheres.push(`block.height >= $${whereArgs.length}`)
  }
  if (endBlock) {
    whereArgs.push(endBlock)
    wheres.push(`block.height <= $${whereArgs.length}`)
  }
  if (startDate) {
    let date = new Date(startDate)
    let seconds = date.getTime() / 1000
    whereArgs.push(seconds)
    wheres.push(`block.timestamp > $${whereArgs.length}`)
  }
  if (endDate) {
    let date = new Date(endDate)
    let seconds = date.getTime() / 1000
    whereArgs.push(seconds)
    wheres.push(`block.timestamp < $${whereArgs.length}`)
  }
  if (miner) {
    whereArgs.push(miner)
    wheres.push(`block.miner = $${whereArgs.length}`)
  }

  skip = Number(skip)
  if (!skip || isNaN(skip)) {
    skip = null
  }
  limit = Number(limit)
  if (isNaN(limit)) {
    limit = null
  }
  if (limit && limit > maxLimit) {
    limit = maxLimit
  }
  if (sortOrder && sortOrder.toUppercase() !== 'ASC' && sortOrder.toUppercase() !== 'DESC') {
    sortOrder = 'DESC'
  }

  const query = `
    SELECT
      block,
      parent,
      block.miner,
      block.height,
      block.parentweight,
      block.timestamp,
      parent.timestamp as parenttimestamp,
      parent.height as parentheight,
      heads.power as power
    FROM
      block_parents
    INNER JOIN
      blocks block ON block_parents.block = block.cid
    INNER JOIN
      blocks parent ON block_parents.parent = parent.cid
    LEFT JOIN
      miner_heads heads ON heads.stateroot = block.parentstateroot and heads.addr = block.miner


    ${wheres.length ? 'WHERE' : ''}
    ${wheres.join(' AND ')}

    ${sortOrder ? `ORDER BY block.height ${sortOrder}` : 'ORDER BY block.height ASC'}

    ${skip ? `OFFSET ${skip}` : ''}

    ${limit ? `LIMIT ${limit}` : ''}
    `

  const { rows } = await db.query(query, whereArgs)

  return rows
}

export const getGraph = async ({ start, end }) => {
  const { rows } = await db.query(
    `
    SELECT
      block,
      parent,
      b.miner,
      b.height,
      b.timestamp

    FROM
      block_parents
    INNER JOIN
      blocks b on block_parents.block = b.cid

    WHERE
      b.height > $1 and b.height < $2`,
    [start, end],
  )

  return rows
}
