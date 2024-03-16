import express, { Request, Response, NextFunction } from "express";
import https from "https";
import http from "http";
import fs from "fs";
import connectDB from "./lib/db";
import { categoriesRouter } from "./controllers/categories";
import { swaggerRouter } from "./controllers/swagger";
import { usersRouter } from "./controllers/users";
import { articleRouter } from "./controllers/articles";
import { startWebSocketServer } from "./websocket/server";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

connectDB();

const app = express();
app.use(express.static(path.join(__dirname, "/../", "public")));
app.use(cors());
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("Request URL: ", req.originalUrl);
  console.log("Request Method: ", req.method);
  next();
});

app.use("/api/categories", categoriesRouter);
app.use("/swagger", swaggerRouter);
app.use("/api/users", usersRouter);
app.use("/api/articles", articleRouter);

// const options = {
//   key: fs.readFileSync("./localhost.key"),
//   cert: fs.readFileSync("./localhost.crt"),
// };

//const server = https.createServer(options, app);
const server = http.createServer(app);
//startWebSocketServer(server)

server.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
});
