import http from "http";
import express from "express";
import cors from "cors";
import {Server} from "colyseus";
import {monitor} from "@colyseus/monitor";

import {TetrolyseusRoom} from "./TetrolyseusRoom";

const port = Number(process.env.PORT || 2567);
const app = express()

app.use(cors());
app.use(express.json())

const server = http.createServer(app);
const gameServer = new Server({
    server,
});

// register our TetrolyseusRoom
gameServer.define('tetrolyseus', TetrolyseusRoom);

// register colyseus monitor AFTER registering your room handlers
app.use("/colyseus", monitor());

gameServer.listen(port);
console.log(`Listening on ws://localhost:${port}`)
