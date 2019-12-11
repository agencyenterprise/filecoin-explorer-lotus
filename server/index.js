import 'dotenv/config'
import express from 'express'
import path from 'path'
import cors from 'cors'

import { Client } from 'pg'

const db = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'pl',
  password: 'postgres',
  port: 32768,
})
const app = express()
app.use(cors())
const port = process.env.PORT || 8888

db.connect()


app.use(express.static(path.join(__dirname, '../build')))

app.get('/api/chain', async (req, res) => {
  const query = await db.query('select block, parent, b.miner, b.height from block_parents inner join blocks b on block_parents.block = b.cid where b.height > $1 and b.height < $2', [0, 200])
  //console.log(query.rows[0].message)
  res.json(query.rows)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
