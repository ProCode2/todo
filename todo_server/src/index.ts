import express, { Express } from "express";
import dotenv from "dotenv";
dotenv.config();
import {router} from "./routes";
import path from "path";

const app: Express = express();

app.use(express.json());

console.log(path.join(__dirname, "public"))
app.use((req, res, next) => {
    if (/(.ico|.js|.css|.jpg|.png|.map)$/i.test(req.path) || req.path.startsWith("/api")) {
        next();
    } else {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
});
app.use("/", express.static(path.join(__dirname, 'public')));

app.use("/api", router);
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
