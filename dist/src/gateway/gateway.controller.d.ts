import { OnModuleInit } from '@nestjs/common';
import { Socket } from 'socket.io';
import { GatewayService } from './gateway.service';
interface IData {
    type: string;
    data: any;
}
interface ICallProps {
    data: IData;
    from: string;
    to: string;
}
export declare class GatewayController implements OnModuleInit {
    private gatewayService;
    constructor(gatewayService: GatewayService);
    onModuleInit(): void;
    handleCreateEvent(socket: Socket, body: {
        phone: string;
    }): void;
    handleCallEvent(socket: Socket, body: ICallProps): void;
}
export {};
