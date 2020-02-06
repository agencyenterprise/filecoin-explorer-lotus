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
    bp.parent as parent,
    main_block.miner,
    main_block.height,
    main_block.parentweight,
    main_block.timestamp,
    parent_block.timestamp as parenttimestamp,
    parent_block.height as parentheight,
    heads.power as parentpower,
    synced.add_ts as syncedtimestamp
  FROM
    blocks main_block
  LEFT JOIN
    block_parents bp ON bp.block = main_block.cid
  LEFT JOIN
    blocks parent_block ON parent_block.cid = bp.parent
  LEFT JOIN
    blocks_synced synced ON synced.cid = main_block.cid
  LEFT JOIN
    miner_heads heads ON heads.stateroot = main_block.parentstateroot and heads.addr = parent_block.miner


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
