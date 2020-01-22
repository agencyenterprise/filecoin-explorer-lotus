import express from "express";
import path from "path";
import cors from "cors";
import nocache from "nocache";
import bodyParser from "body-parser";
import { initializeRequestLogger } from "./services/logger";

import { routes } from "./routes";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(nocache());
app.use(express.static(path.join(__dirname, "../build")));

if (process.env.NODE_ENV !== "test") {
  initializeRequestLogger(app);
}

app.use("/api", routes);

export { app };
