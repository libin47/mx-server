"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _EventManagerService_key, _EventManagerService_handlers;
var EventManagerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventManagerService = void 0;
const lodash_1 = require("lodash");
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const business_event_constant_1 = require("../../constants/business-event.constant");
const events_gateway_1 = require("../gateway/admin/events.gateway");
const base_gateway_1 = require("../gateway/base.gateway");
const events_gateway_2 = require("../gateway/system/events.gateway");
const events_gateway_3 = require("../gateway/web/events.gateway");
let EventManagerService = EventManagerService_1 = class EventManagerService {
    constructor(webGateway, adminGateway, systemGateway, emitter2) {
        this.webGateway = webGateway;
        this.adminGateway = adminGateway;
        this.systemGateway = systemGateway;
        this.emitter2 = emitter2;
        this.defaultOptions = {
            scope: business_event_constant_1.EventScope.TO_SYSTEM,
            nextTick: false,
        };
        this.mapScopeToInstance = {
            [business_event_constant_1.EventScope.ALL]: [
                this.webGateway,
                this.adminGateway,
                this.emitter2,
                this.systemGateway,
            ],
            [business_event_constant_1.EventScope.TO_VISITOR]: [this.webGateway],
            [business_event_constant_1.EventScope.TO_ADMIN]: [this.adminGateway],
            [business_event_constant_1.EventScope.TO_SYSTEM]: [this.emitter2, this.systemGateway],
            [business_event_constant_1.EventScope.TO_VISITOR_ADMIN]: [this.webGateway, this.adminGateway],
            [business_event_constant_1.EventScope.TO_SYSTEM_VISITOR]: [
                this.emitter2,
                this.webGateway,
                this.systemGateway,
            ],
            [business_event_constant_1.EventScope.TO_SYSTEM_ADMIN]: [
                this.emitter2,
                this.adminGateway,
                this.systemGateway,
            ],
        };
        _EventManagerService_key.set(this, 'event-manager');
        _EventManagerService_handlers.set(this, []);
        this.logger = new common_1.Logger(EventManagerService_1.name);
        this.listenSystemEvents();
        this.logger.debug('EventManagerService is ready');
    }
    async emit(event, data = null, _options) {
        const options = (0, lodash_1.merge)({}, this.defaultOptions, _options);
        const { scope = this.defaultOptions.scope, nextTick = this.defaultOptions.nextTick, } = options;
        const instances = this.mapScopeToInstance[scope];
        const tasks = Promise.all(instances.map((instance) => {
            if (instance instanceof event_emitter_1.EventEmitter2) {
                const isObjectLike = typeof data === 'object' && data !== null;
                const payload = isObjectLike ? data : { data };
                return instance.emit(__classPrivateFieldGet(this, _EventManagerService_key, "f"), {
                    event,
                    payload,
                });
            }
            else if (instance instanceof base_gateway_1.BoardcastBaseGateway) {
                return instance.broadcast(event, data);
            }
        }));
        if (nextTick) {
            process.nextTick(async () => await tasks);
        }
        else {
            await tasks;
        }
    }
    on(event, handler) {
        const handler_ = (payload) => {
            if (payload.event === event) {
                handler(payload.payload);
            }
        };
        const cleaner = this.emitter2.on(__classPrivateFieldGet(this, _EventManagerService_key, "f"), handler_);
        return () => {
            cleaner.off(__classPrivateFieldGet(this, _EventManagerService_key, "f"), handler_);
        };
    }
    registerHandler(handler) {
        __classPrivateFieldGet(this, _EventManagerService_handlers, "f").push(handler);
        return () => {
            const index = __classPrivateFieldGet(this, _EventManagerService_handlers, "f").findIndex((h) => h === handler);
            __classPrivateFieldGet(this, _EventManagerService_handlers, "f").splice(index, 1);
        };
    }
    listenSystemEvents() {
        this.emitter2.on(__classPrivateFieldGet(this, _EventManagerService_key, "f"), (data) => {
            const { event, payload } = data;
            console.debug(`Received event: [${event}]`, payload);
            this.emitter2.emit(event, payload);
            __classPrivateFieldGet(this, _EventManagerService_handlers, "f").forEach((handler) => handler(event, payload));
        });
    }
    get broadcast() {
        return this.emit;
    }
};
_EventManagerService_key = new WeakMap(), _EventManagerService_handlers = new WeakMap();
EventManagerService = EventManagerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [events_gateway_3.WebEventsGateway,
        events_gateway_1.AdminEventsGateway,
        events_gateway_2.SystemEventsGateway,
        event_emitter_1.EventEmitter2])
], EventManagerService);
exports.EventManagerService = EventManagerService;
