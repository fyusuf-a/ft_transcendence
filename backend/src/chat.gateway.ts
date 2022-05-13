import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { CreateMessageDto } from './messages/dto/create-message.dto';
import { MessagesService } from './messages/messages.service';
import * as jwt from 'jsonwebtoken';
import { UsersService } from './users/users.service';
import { User } from './users/entities/user.entity';
import { TokenUserDto } from './auth/dto/token-user.dto';

export class ChatJoinDto {
  channel: string;
}

export class ChatSendDto {
  channel: string;
  message: string;
}

@WebSocketGateway({ cors: true })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly messagesService: MessagesService,
    private readonly usersService: UsersService,
  ) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');
  private authenticatedSockets: Map<string, User> = new Map();

  private checkAuth(client: Socket): boolean {
    if (this.authenticatedSockets.has(client.id)) return true;
    throw new WsException('Not Authorized');
  }

  @SubscribeMessage('chat-join')
  handleJoin(client: Socket, payload: ChatJoinDto) {
    this.logger.log(`${client.id} wants to join room [${payload.channel}]`);
    this.checkAuth(client);
    // Check if User has permission to join channel here
    client.join(payload.channel);
    return `Successfully joined channel ${payload.channel}`;
  }

  @SubscribeMessage('chat-auth')
  async handleAuth(client: Socket, payload: any) {
    this.logger.log(
      `Client ${client.id} is trying to auth socket with token: ${payload.authorization}`,
    );
    try {
      const token = payload.authorization;
      const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await this.usersService.findOne(
        +(decode as TokenUserDto).id,
      );
      if (!user) {
        throw new WsException('Invalid Token');
      }
      this.authenticatedSockets.set(client.id, user);
      return 'SUCCESS';
    } catch (err) {
      this.authenticatedSockets.delete(client.id);
      throw new WsException('Not Authorized');
    }
  }

  @SubscribeMessage('chat-send')
  handleSend(client: Socket, payload: ChatSendDto): string {
    this.checkAuth(client);
    const target = payload.channel;
    const message = payload.message;
    if (!target || !message) {
      return `ERROR: Invalid payload: ${payload}`;
    }
    this.logger.log(
      `${client.id} wants to send ["${message}"] to target ${target}!`,
    );
    const messageDto = new CreateMessageDto();
    messageDto.channelId = parseInt(payload.channel);
    messageDto.content = message;
    messageDto.senderId = this.authenticatedSockets.get(client.id).id;

    // Check if User has permission to send message here
    this.server
      .to(target)
      .emit('message', messageDto.senderId, target, message);
    this.messagesService.create(messageDto);
    return 'Message Confirmed';
  }

  afterInit() {
    this.logger.log('Initialized');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.authenticatedSockets.delete(client.id);
  }

  async handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
