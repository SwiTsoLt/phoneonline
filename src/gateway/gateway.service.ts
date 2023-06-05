import { Injectable } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { WebSocketServer, WebSocketGateway } from '@nestjs/websockets';

interface IClient {
  id: string;
  line: string
}

interface IClients {
  [key: string]: IClient;
}

export interface IErrorMessage {
  msg: string;
}

@Injectable()
@WebSocketGateway()
export class GatewayService {
  @WebSocketServer()
  private server: Server;

  private clients: IClients = {};

  public init() {
    this.server.on('connection', (socket: Socket) => {
      console.log('connect', socket.id);

      socket.on('disconnect', () => {
        for (const phone in this.clients) {
          const client = this.clients[phone]
          console.log(phone, client);
          if (client.id === socket.id) {
            delete this.clients[phone]
          }
        }
      })
    });
  }

  public create(socket: Socket, phone: string): IErrorMessage | void {
    if (this.clients[phone]) {
      return { msg: 'Такой номер уже зарезервирован' };
    }

    this.clients[phone] = { id: socket.id, line: '' };
    console.log('registered', socket.id, 'as', phone);
  }

  public rtcData(from: string, to: string, data: any) {
    const client = this.clients[to]

    if (!client) {
      console.log(data);
      return { msg: `Номер '${to}' не найден` };
    }

    if (from === to) {
      return { msg: 'Вы не можете позвонить сами себе' }
    }

    if (client.line.length) {
      return { msg: 'Абонент занят' }
    }

    const clientSocket = this.server.sockets.sockets.get(client.id)
    clientSocket.emit('rtcData', { from, data })
  }
}
