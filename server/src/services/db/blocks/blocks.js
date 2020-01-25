import { db } from '../'

export const getBlockById = async (id) => {
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
      block = $1`,
    [id],
  )

  if (!rows.length) return []
  return rows[0]
}

export const getBlockRange = async () => {
  console.log('making query')
  const { rows } = await db.query(
    `
    SELECT
      MIN(height) AS "minHeight",
      MAX(height) AS "maxHeight"

    FROM
      blocks
    `,
    [],
  )

  console.log('query ok')

  if (!rows || !rows.length) {
    console.log('empty')

    return {}
  }

  return rows[0]
}
