"use strict";
exports.__esModule = true;
var connectionManager_1 = require("./connectionManager");
var matchMaking_1 = require("./matchMaking");
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server, {
    cors: {
        origin: "http://192.168.1.55:3000"
    }
});
var matchMaking = new matchMaking_1["default"]();
var connectionManager = new connectionManager_1.ConnectionManagerImpl(io, matchMaking);
matchMaking.setConnManager(connectionManager);
server.listen(8080, function () {
    console.log("Running on port 8080...");
});
