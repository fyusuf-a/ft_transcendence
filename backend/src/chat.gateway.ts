import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { MessagesService } from './messages/messages.service';
import { UsersService } from './users/users.service';
import { instanceToInstance } from 'class-transformer';
import { ResponseMessageDto, CreateMessageDto } from '@dtos/messages';

import { MembershipsService } from './memberships/memberships.service';
import { ConfigService } from '@nestjs/config';
import { MembershipRoleType } from './memberships/entities/membership.entity';
import { CreateMembershipDto } from '@dtos/memberships';
import { SecureGateway, CheckAuth } from './auth/auth.websocket';

export class ChatJoinDto {
  channel: string;
}

export class ChatSendDto {
  channel: string;
  message: string;
}

@WebSocketGateway({ cors: true, namespace: 'chat' })
export class ChatGateway extends SecureGateway {
  constructor(
    private readonly messagesService: MessagesService,
    protected readonly usersService: UsersService,
    private readonly membershipsService: MembershipsService,
    protected readonly configService: ConfigService,
  ) {
    super('ChatGateway', usersService, configService);
  }

  @WebSocketServer() server: Server;

  @SubscribeMessage('chat-join')
  @CheckAuth
  async handleJoin(client: Socket, payload: ChatJoinDto) {
    this.logger.log(`${client.id} wants to join room [${payload.channel}]`);
    // TODO: Check if User has permission to join channel here
    const membershipDto: CreateMembershipDto = {
      channelId: +payload.channel,
      userId: this.getAuthenticatedUser(client)?.id,
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
  @CheckAuth
  async handleLeave(client: Socket, payload: ChatJoinDto) {
    if (!payload?.channel) return 'FAILURE';
    this.logger.log(`${client.id} wants to leave channel [${payload.channel}]`);
    // TODO: Check if User leaving affects ownership
    client.leave(payload.channel);
    const membershipArray = await this.membershipsService.findAll({
      channel: payload.channel,
      user: this.getAuthenticatedUser(client)?.id.toString(),
    });
    if (membershipArray && membershipArray.length === 1) {
      const membership = membershipArray[0];
      if (
        membership &&
        membership.id &&
        membership.userId === this.getAuthenticatedUser(client)?.id &&
        membership.channelId === parseInt(payload.channel)
      ) {
        await this.membershipsService.remove(membership.id);
        return `SUCCESS: left channel and room ${payload.channel}`;
      }
    }
  }

  @SubscribeMessage('chat-send')
  @CheckAuth
  async handleSend(client: Socket, payload: ChatSendDto): Promise<string> {
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
    messageDto.senderId = this.getAuthenticatedUser(client)?.id;

    // TODO: Check if User has permission to send message here
    const messageResponse = await this.messagesService.create(messageDto);
    const messageResponseDto: ResponseMessageDto =
      instanceToInstance(messageResponse);
    this.server.to(target).emit('chat-message', messageResponseDto);
    return 'Message Confirmed';
  }
}
