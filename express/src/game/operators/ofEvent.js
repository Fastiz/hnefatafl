"use strict";
exports.__esModule = true;
exports.ofEvent = void 0;
var operators_1 = require("rxjs/operators");
function ofEvent(event) {
    return function (source) {
        return source.pipe(operators_1.filter(function (message) {
            var evn = message.event;
            return event === evn;
        }));
    };
}
exports.ofEvent = ofEvent;
