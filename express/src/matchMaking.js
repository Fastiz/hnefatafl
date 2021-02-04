"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.MatchMakingImpl = void 0;
var broker_1 = require("./broker");
var gameInstance_1 = require("./game/gameInstance");
var MatchMakingImpl = /** @class */ (function () {
    function MatchMakingImpl() {
        this.state = {
            memberIds: []
        };
    }
    MatchMakingImpl.prototype.setConnManager = function (connManager) {
        this.connManager = connManager;
    };
    MatchMakingImpl.prototype.register = function (id) {
        var memberIds = this.state.memberIds;
        this.state = {
            memberIds: __spreadArrays(memberIds, [id])
        };
        this.checkMatches();
    };
    MatchMakingImpl.prototype.unregister = function (id) {
        var memberIds = this.state.memberIds;
        var index = memberIds.findIndex(function (_id) { return id === _id; });
        if (index === -1)
            return;
        var copy = __spreadArrays(memberIds);
        copy.splice(index, 1);
        this.state = {
            memberIds: copy
        };
    };
    MatchMakingImpl.prototype.checkMatches = function () {
        if (this.state.memberIds.length >= 2) {
            var _a = this.state.memberIds, id1 = _a[0], id2 = _a[1];
            var broker = new broker_1["default"](this.connManager.socketById(id1), this.connManager.socketById(id2));
            var gameInstance = new gameInstance_1["default"](broker);
            this.unregister(id1);
            this.unregister(id2);
        }
    };
    return MatchMakingImpl;
}());
exports.MatchMakingImpl = MatchMakingImpl;
exports["default"] = MatchMakingImpl;
