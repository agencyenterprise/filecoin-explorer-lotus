import "dotenv/config";
import express from "express";
import path from "path";
import cors from "cors";

import { Client } from "pg";

const dbParams = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: true
    }
  : {
      user: "melanie",
      host: "localhost",
      database: "pl",
      password: "",
      port: 5432
    };
const db = new Client(dbParams);

const app = express();
app.use(cors());
const port = process.env.PORT || 8888;

db.connect();

app.use(express.static(path.join(__dirname, "../build")));

app.get("/api/chain", async (req, res) => {
  const query = await db.query(
    `
    select
      block,
      parent,
      b.miner,
      b.height,
      b.timestamp
    from
      block_parents
    inner join
      blocks b on block_parents.block = b.cid
    where b.height > $1 and b.height < $2`,
    [1000, 1200]
  );
  //console.log(query.rows[0].message)
  res.json(query.rows);
});

app.get("/api/chain/graph.json", async (req, res) => {
  const query = await db.query(
    `
    select
      block,
      parent,
      b.miner,
      b.height,
      b.timestamp
    from
      block_parents
    inner join
      blocks b on block_parents.block = b.cid
    where b.height > $1 and b.height < $2`,
    [13800, 14000]
  );

  const chain = {
    nodes: [],
    links: []
  };
  const blocks = {};

  query.rows.forEach(block => {
    blocks[block.block] = chain.nodes.length;
    chain.nodes.push({
      id: blocks[block.block],
      name: `${block.miner}:${block.height}`,
      miner: block.miner
      //name: blocks[block.block],
      //title: block.block
    });
    chain.links.push({
      sourcename: blocks[block.block],
      targetname: blocks[block.parent]
    });
  });

  //console.log(query.rows[0].message)
  res.json(chain);
});

app.get("/api/block/:id", async (req, res) => {
  const query = await db.query(
    `
    select
      block,
      parent,
      b.miner,
      b.height,
      b.timestamp
    from
      block_parents
    inner join
      blocks b on block_parents.block = b.cid
    where block=?`,
    [req.params.id]
  );
  //console.log(query.rows[0].message)
  res.json(query.rows);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
