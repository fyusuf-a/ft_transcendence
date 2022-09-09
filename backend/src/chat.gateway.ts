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
import { MessagesService } from './messages/messages.service';
import * as jwt from 'jsonwebtoken';
import { UsersService } from './users/users.service';
import { User } from './users/entities/user.entity';
import { TokenUserDto } from '@dtos/auth';
import { instanceToInstance } from 'class-transformer';
import { ResponseMessageDto, CreateMessageDto } from '@dtos/messages';

import { MembershipsService } from './memberships/memberships.service';
import { ConfigService } from '@nestjs/config';
import { MembershipRoleType } from './memberships/entities/membership.entity';
import { CreateMembershipDto } from '@dtos/memberships';

export class ChatJoinDto {
  channel: string;
}

export class ChatSendDto {
  channel: string;
  message: string;
}

@WebSocketGateway({ cors: true, namespace: 'chat' })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly messagesService: MessagesService,
    private readonly usersService: UsersService,
    private readonly membershipsService: MembershipsService,
    private configService: ConfigService,
  ) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');
  private authenticatedSockets: Map<string, User> = new Map();

  private checkAuth(client: Socket): boolean {
    if (
      this.configService.get<string>('DISABLE_AUTHENTICATION') == 'true' ||
      this.authenticatedSockets.has(client.id)
    ) {
      return true;
    }
    throw new WsException('Not Authorized');
  }

  @SubscribeMessage('chat-join')
  async handleJoin(client: Socket, payload: ChatJoinDto) {
    this.logger.log(`${client.id} wants to join room [${payload.channel}]`);
    this.checkAuth(client);
    // TODO: Check if User has permission to join channel here
    const membershipDto: CreateMembershipDto = {
      channelId: +payload.channel,
      userId: this.authenticatedSockets.get(client.id)?.id,
      role: MembershipRoleType.PARTICIPANT,
    };
    try {
      await this.membershipsService.create(membershipDto);
    } catch (error) {
      if (error.code == 23505) {
        // Duplicate Key Error
        this.logger.log(
          `User ${membershipDto.userId} is already a member of channel ${payload.channel}`,
        );
      } else {
        throw error;
      }
    }
    client.join(payload.channel);
    return `SUCCESS: joined room for channel ${payload.channel}`;
  }

  @SubscribeMessage('chat-leave')
  async handleLeave(client: Socket, payload: ChatJoinDto) {
    if (!payload?.channel) return 'FAILURE';
    this.logger.log(`${client.id} wants to leave channel [${payload.channel}]`);
    this.checkAuth(client);
    // TODO: Check if User leaving affects ownership
    client.leave(payload.channel);
    const membershipArray = await this.membershipsService.findAll({
      channel: payload.channel,
      user: this.authenticatedSockets.get(client.id).id.toString(),
    });
    if (membershipArray && membershipArray.length === 1) {
      const membership = membershipArray[0];
      if (
        membership &&
        membership.id &&
        membership.userId === this.authenticatedSockets.get(client.id).id &&
        membership.channelId === parseInt(payload.channel)
      ) {
        await this.membershipsService.remove(membership.id);
        return `SUCCESS: left channel and room ${payload.channel}`;
      }
    }
  }

  @SubscribeMessage('chat-auth')
  async handleAuth(client: Socket, payload: { id: number; token: string }) {
    this.logger.log(
      `Client ${client.id} is trying to auth socket with token: ${payload.token}`,
    );
    try {
      let id: number = payload.id;
      if (
        this.configService.get<string>('DISABLE_AUTHENTICATION') === 'false'
      ) {
        const decode = jwt.verify(payload.token, process.env.JWT_SECRET_KEY);
        id = (decode as TokenUserDto).id;
      }
      const user = await this.usersService.findOne(id);
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
  async handleSend(client: Socket, payload: ChatSendDto): Promise<string> {
    this.checkAuth(client);
    const target = payload.channel;
    const message = payload.message;
    if (!target || !message) {
      return `ERROR: Invalid payload: ${JSON.stringify(payload)}`;
    }
    this.logger.log(
      `${client.id} wants to send ["${message}"] to target ${target}!`,
    );
    const messageDto = new CreateMessageDto();
    messageDto.channelId = parseInt(payload.channel);
    messageDto.content = message;
    messageDto.senderId = this.authenticatedSockets.get(client.id).id;

    // TODO: Check if User has permission to send message here
    const messageResponse = await this.messagesService.create(messageDto);
    const messageResponseDto: ResponseMessageDto =
      instanceToInstance(messageResponse);
    this.server.to(target).emit('chat-message', messageResponseDto);
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
