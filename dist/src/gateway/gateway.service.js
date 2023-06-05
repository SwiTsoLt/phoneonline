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
exports.GatewayService = void 0;
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const websockets_1 = require("@nestjs/websockets");
let GatewayService = class GatewayService {
    constructor() {
        this.clients = {};
    }
    init() {
        this.server.on('connection', (socket) => {
            console.log('connect', socket.id);
            socket.on('disconnect', () => {
                for (const phone in this.clients) {
                    const client = this.clients[phone];
                    console.log(phone, client);
                    if (client.id === socket.id) {
                        delete this.clients[phone];
                    }
                }
            });
        });
    }
    create(socket, phone) {
        if (this.clients[phone]) {
            return { msg: 'Такой номер уже зарезервирован' };
        }
        this.clients[phone] = { id: socket.id, line: '' };
        console.log('registered', socket.id, 'as', phone);
    }
    rtcData(from, to, data) {
        const client = this.clients[to];
        if (!client) {
            console.log(data);
            return { msg: `Номер '${to}' не найден` };
        }
        if (from === to) {
            return { msg: 'Вы не можете позвонить сами себе' };
        }
        if (client.line.length) {
            return { msg: 'Абонент занят' };
        }
        const clientSocket = this.server.sockets.sockets.get(client.id);
        clientSocket.emit('rtcData', { from, data });
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GatewayService.prototype, "server", void 0);
GatewayService = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)()
], GatewayService);
exports.GatewayService = GatewayService;
//# sourceMappingURL=gateway.service.js.map