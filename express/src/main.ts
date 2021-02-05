import ConnectionManager from "./connectionManager";
import MatchMaking from "./matchMaking";
import {MESSAGES} from "./game/constants";

const express = require('express');
const app = express();
const server = require('http').Server(app);
export const io = require('socket.io')(server, {
    cors: {
        // origin: "http://64.227.1.4",
        origin: "http://localhost:3000"
    }
});

const connectionManager = new ConnectionManager();

const matchMaking = new MatchMaking(connectionManager.getConnectionSubject());


server.listen(8080, () => {
    console.log("Running on port 8080...")
});
