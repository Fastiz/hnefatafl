"use strict";
exports.__esModule = true;
exports.chatMessageToSocketMessage = exports.pieceMoveToSocketMessage = void 0;
var constants_1 = require("./constants");
function pieceMoveToSocketMessage(move) {
    return {
        event: constants_1.MESSAGES.PIECE_MOVED,
        data: move
    };
}
exports.pieceMoveToSocketMessage = pieceMoveToSocketMessage;
function chatMessageToSocketMessage(message) {
    return {
        event: constants_1.MESSAGES.CHAT_MESSAGE,
        data: message
    };
}
exports.chatMessageToSocketMessage = chatMessageToSocketMessage;
