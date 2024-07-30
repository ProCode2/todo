import express, { Express } from "express";
import dotenv from "dotenv";
dotenv.config();
import {router} from "./routes";

const app: Express = express();
app.use(express.json());

app.use(router);
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
