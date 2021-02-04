import {ConnectionManager, ConnectionManagerImpl} from "./connectionManager";
import MatchMakingImpl, {MatchMaking} from "./matchMaking";

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "http://64.227.1.4",
    }
});

const matchMaking: MatchMaking = new MatchMakingImpl();
const connectionManager: ConnectionManager = new ConnectionManagerImpl(io, matchMaking);

matchMaking.setConnManager(connectionManager);

server.listen(8080, () => {
    console.log("Running on port 8080...")
});
