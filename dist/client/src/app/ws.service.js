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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketService = void 0;
const core_1 = require("@angular/core");
const rxjs_1 = require("rxjs");
const io = require("socket.io-client");
let WebSocketService = class WebSocketService {
    constructor() {
        this.uri = '';
        this.socket = io.connect(this.uri);
        this.uri = this.getUri();
    }
    getUri() {
        const origin = window.location.href
            .split('//')[1]
            .split(':')[0]
            .split('/')[0];
        return window.location.href.includes('https')
            ? `wss://${origin}`
            : `ws://${origin}:3000`;
    }
    listen(eventName) {
        return new rxjs_1.Observable((subscriber) => {
            this.socket.on(eventName, (data) => {
                subscriber.next(data);
            });
        });
    }
    emit(eventName, data) {
        this.socket.emit(eventName, data);
    }
    disconnect() {
        this.socket.disconnect();
    }
    getSocketId() {
        return this.socket.id;
    }
};
WebSocketService = __decorate([
    (0, core_1.Injectable)({
        providedIn: 'root',
    }),
    __metadata("design:paramtypes", [])
], WebSocketService);
exports.WebSocketService = WebSocketService;
//# sourceMappingURL=ws.service.js.map