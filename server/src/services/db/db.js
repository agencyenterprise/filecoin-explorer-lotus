import { Client } from "pg";

const dbParams = {
  connectionString: process.env.DATABASE_URL
};

console.log(dbParams.connectionString);

export const db = new Client(dbParams);

export const connect = () =>
  new Promise(resolve => {
    console.log("Connected to database.");
    db.connect(resolve);
  });
