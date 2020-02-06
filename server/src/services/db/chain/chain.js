import { db } from '../'

export const getChain = async ({ startBlock, endBlock, startDate, endDate, miner, skip, limit, sortOrder }) => {
  const maxLimit = 500
  let wheres = []
  let whereArgs = []

  if (startBlock) {
    whereArgs.push(Number(startBlock))
    wheres.push(`main_block.height >= $${whereArgs.length}`)
  }
  if (endBlock) {
    whereArgs.push(endBlock)
    wheres.push(`main_block.height <= $${whereArgs.length}`)
  }
  if (startDate) {
    let date = new Date(startDate)
    let seconds = date.getTime() / 1000
    whereArgs.push(seconds)
    wheres.push(`main_block.timestamp > $${whereArgs.length}`)
  }
  if (endDate) {
    let date = new Date(endDate)
    let seconds = date.getTime() / 1000
    whereArgs.push(seconds)
    wheres.push(`main_block.timestamp < $${whereArgs.length}`)
  }
  if (miner) {
    whereArgs.push(miner)
    wheres.push(`main_block.miner = $${whereArgs.length}`)
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
      main_block.cid as block,
      block_parent.cid as parent,
      main_block.miner,
      main_block.height,
      main_block.parentweight,
      main_block.timestamp,
      block_parent.timestamp as parenttimestamp,
      block_parent.height as parentheight,
      heads.power as parentpower
    FROM
      block_parents bp
    INNER JOIN
      blocks main_block ON bp.block = main_block.cid
    INNER JOIN
      blocks block_parent ON bp.parent = block_parent.cid
    LEFT JOIN
      miner_heads heads ON heads.stateroot = main_block.parentstateroot and heads.addr = block_parent.miner


    ${wheres.length ? 'WHERE' : ''}
    ${wheres.join(' AND ')}

    ${sortOrder ? `ORDER BY main_block.height ${sortOrder}` : 'ORDER BY main_block.height ASC'}

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
