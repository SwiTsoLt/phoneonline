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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayController = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const gateway_service_1 = require("./gateway.service");
let GatewayController = class GatewayController {
    constructor(gatewayService) {
        this.gatewayService = gatewayService;
    }
    onModuleInit() {
        this.gatewayService.init();
    }
    handleCreateEvent(socket, body) {
        const response = this.gatewayService.create(socket, body.phone);
        if (response) {
            socket.send(response);
        }
    }
    handleCallEvent(socket, body) {
        console.log(body);
        const response = this.gatewayService.rtcData(body.from, body.to, body);
        if (response) {
            socket.send(response);
        }
    }
};
__decorate([
    (0, websockets_1.SubscribeMessage)('create'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GatewayController.prototype, "handleCreateEvent", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('rtcData'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GatewayController.prototype, "handleCallEvent", null);
GatewayController = __decorate([
    (0, websockets_1.WebSocketGateway)(),
    __metadata("design:paramtypes", [gateway_service_1.GatewayService])
], GatewayController);
exports.GatewayController = GatewayController;
//# sourceMappingURL=gateway.controller.js.map