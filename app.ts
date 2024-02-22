import express, { Request, Response, NextFunction } from "express";
import http from "http"
import connectDB from "./lib/db";
import { categoriesRouter } from "./controllers/categories";
import { swaggerRouter } from "./controllers/swagger";
import { usersRouter } from "./controllers/users";
import { articleRouter } from "./controllers/articles";
import { startWebSocketServer } from "./websocket/server";
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()

connectDB();

const app = express();
app.use(cors())
app.use(express.json());


app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("Request URL: ", req.originalUrl);
  console.log("Request Method: ", req.method);
  next();
});

app.use("/api/categories", categoriesRouter)
app.use("/swagger", swaggerRouter)
app.use("/api/users", usersRouter)
app.use("/api/articles", articleRouter)

const server = http.createServer(app)
//startWebSocketServer(server)

server.listen(8888, () => {
  console.log("Server is running on port 8888");
});