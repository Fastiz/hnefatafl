"use strict";
exports.__esModule = true;
exports.pieceMoveFromSocketMessage = void 0;
var operators_1 = require("rxjs/operators");
function pieceMoveFromSocketMessage(team) {
    return function (source) {
        return source.pipe(operators_1.map(function (message) {
            var _a = message.data, to = _a.to, from = _a.from;
            return {
                to: to, from: from, team: team
            };
        }));
    };
}
exports.pieceMoveFromSocketMessage = pieceMoveFromSocketMessage;
