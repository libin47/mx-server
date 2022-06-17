"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBusEvents = void 0;
var EventBusEvents;
(function (EventBusEvents) {
    EventBusEvents["EmailInit"] = "email.init";
    EventBusEvents["PushSearch"] = "search.push";
    EventBusEvents["TokenExpired"] = "token.expired";
    EventBusEvents["CleanAggregateCache"] = "cache.aggregate";
    EventBusEvents["SystemException"] = "system.exception";
    EventBusEvents["ConfigChanged"] = "config.changed";
})(EventBusEvents = exports.EventBusEvents || (exports.EventBusEvents = {}));
