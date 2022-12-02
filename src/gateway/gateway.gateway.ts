import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { GatewayService } from './gateway.service';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway(3001)
export class GatewayGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly gatewayService: GatewayService) {}

  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() message: any) {
    console.log(message);
  }

  private logger = new Logger('AppGateway');

  handleConnection(client: any) {
    this.logger.log(`New client "${client.id}" connected`);
    client.emit('connection', 'Successfully connected to server');
  }

  handleDisconnect(client: any) {
    this.logger.log(`Client "${client}" disconnected`);
  }
}
