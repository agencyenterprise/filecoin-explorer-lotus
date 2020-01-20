import { Client } from "pg";

const dbParams = {
  connectionString: process.env.DATABASE_URL
}

export const db = new Client(dbParams);

export const connect = () => {
  db.connect();
}
