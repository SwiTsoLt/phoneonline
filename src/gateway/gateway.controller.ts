import { OnModuleInit } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GatewayService, IErrorMessage } from './gateway.service';

interface IData {
  type: string,
  data: any
}

interface ICallProps {
  data: IData,
  from: string,
  to: string
}

@WebSocketGateway()
export class GatewayController implements OnModuleInit {
  constructor(private gatewayService: GatewayService) {}

  onModuleInit() {
    this.gatewayService.init();
  }

  @SubscribeMessage('create')
  handleCreateEvent(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: { phone: string },
  ) {
    const response: IErrorMessage | void = this.gatewayService.create(socket, body.phone);
    if (response) {
      socket.send(response)
    }
  }

  @SubscribeMessage('rtcData')
  handleCallEvent(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: ICallProps
  ) {
    console.log(body);

    const response: IErrorMessage | void = this.gatewayService.rtcData(body.from, body.to, body);
  
    if (response) {
      socket.send(response)
    }
  }
}
