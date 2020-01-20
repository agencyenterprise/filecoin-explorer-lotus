import { db } from '../'

export const getChain = async ({
  startBlock,
  endBlock,
  startDate,
  endDate,
  miner,
  skip,
  limit,
  sortOrder,
}) => {
  const maxLimit = 500;
  let wheres = []
  let whereArgs = []

  if (startBlock) {
    whereArgs.push(startBlock)
    wheres.push(`b.height > $${whereArgs.length}`)
  }
  if (endBlock) {
    whereArgs.push(endBlock)
    wheres.push(`b.height < $${whereArgs.length}`)
  }
  if (startDate) {
    let date = new Date(startDate);
    let seconds = date.getTime() / 1000;
    whereArgs.push(seconds)
    wheres.push(`b.timestamp > $${whereArgs.length}`)
  }
  if (endDate) {
    let date = new Date(endDate);
    let seconds = date.getTime() / 1000;
    whereArgs.push(seconds)
    wheres.push(`b.timestamp < $${whereArgs.length}`)
  }
  if (miner) {
    whereArgs.push(miner)
    wheres.push(`b.miner = $${whereArgs.length}`)
  }

  if (!skip || isNan(skip)) {
    skip = 0;
  }
  if (!limit || isNan(limit) || limit > maxLimit) {
    limit = maxLimit
  }
  if (!sortOrder || (sortOrder.toUppercase() !== 'ASC' && sortOrder.toUppercase() !== 'DESC')) {
    sortOrder = 'DESC'
  }

  const { rows } = await db.query(
    `
      SELECT
        block,
        parent,
        b.miner,
        b.height,
        b.parentweight,
        b.timestamp,
        p.timestamp as parenttimestamp

      FROM
        block_parents
      INNER JOIN
        blocks b on block_parents.block = b.cid
      INNER JOIN
        blocks p on block_parents.parent = p.cid

      ${wheres.length ? 'WHERE' : ''}
        ${wheres.join(' AND ')}

      ORDER BY
        timestamp ${sortOrder}

      OFFSET
        ${skip}

      LIMIT
        ${limit}
    `,
    whereArgs
  );

  return rows;
}

export const getGraph = async ({start, end}) => {
  const { rows }= await db.query(
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
    [start, end]
  );

  return rows;
}
