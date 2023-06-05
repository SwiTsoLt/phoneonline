import { Socket } from 'socket.io';
export interface IErrorMessage {
    msg: string;
}
export declare class GatewayService {
    private server;
    private clients;
    init(): void;
    create(socket: Socket, phone: string): IErrorMessage | void;
    rtcData(from: string, to: string, data: any): {
        msg: string;
    };
}
