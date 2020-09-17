import http from "http";
import express from "express";
import cors from "cors";
import {Server} from "colyseus";
import {monitor} from "@colyseus/monitor";

import {TetrolyseusRoom} from "./TetrolyseusRoom";
import {join} from "path";

const port = Number(process.env.PORT || 2567);
const app = express()

const staticPath = join(__dirname, '../public');
console.log(`Using static path '${staticPath}'`);
app.use(express.static(staticPath));

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
