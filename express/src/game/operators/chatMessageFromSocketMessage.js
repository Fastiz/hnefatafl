"use strict";
exports.__esModule = true;
exports.chatMessageFromSocketMessage = void 0;
var operators_1 = require("rxjs/operators");
function chatMessageFromSocketMessage(team) {
    return function (source) {
        return source.pipe(operators_1.map(function (socketMessage) {
            var message = socketMessage.data.message;
            return {
                from: team,
                message: message
            };
        }));
    };
}
exports.chatMessageFromSocketMessage = chatMessageFromSocketMessage;
