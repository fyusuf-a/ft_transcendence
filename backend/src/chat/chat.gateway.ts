import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { MessagesService } from 'src/messages/messages.service';
import { UsersService } from 'src/users/users.service';
import { instanceToInstance } from 'class-transformer';
import { ResponseMessageDto, CreateMessageDto } from '@dtos/messages';

import { MembershipsService } from 'src/memberships/memberships.service';
import { ConfigService } from '@nestjs/config';
import { CreateMembershipDto, QueryMembershipDto } from '@dtos/memberships';
import { OnEvent } from '@nestjs/event-emitter';
import { ChannelsService } from 'src/channels/channels.service';
import { User } from 'src/users/entities/user.entity';
import { MembershipRoleType } from 'src/memberships/entities/membership.entity';
import { SecureGateway, CheckAuth } from 'src/auth/auth.websocket';

export class ChatJoinDto {
  channel: string;
  password?: string;
}

export class ChatSendDto {
  channel: string;
  message: string;
}

@WebSocketGateway({ cors: true, namespace: 'chat' })
export class ChatGateway extends SecureGateway {
  constructor(
    protected readonly usersService: UsersService,
    protected readonly configService: ConfigService,
    private readonly messagesService: MessagesService,
    private readonly membershipsService: MembershipsService,
    private readonly channelsService: ChannelsService,
  ) {
    super('ChatGateway', usersService, configService);
  }

  @WebSocketServer() server: Server;

  @SubscribeMessage('chat-listen')
  @CheckAuth
  async handleListen(client: Socket) {
    this.logger.log(`${client.id} wants to listen to their channels`);
    const query: QueryMembershipDto = {
      user: `${this.getAuthenticatedUser(client)?.id}`,
    };
    const memberships = await this.membershipsService.findAll(query);
    for (const membership of memberships) {
      if (!membership.bannedUntil) {
        this.logger.log(
          `Subscribing ${client.id} to channel: [${membership.channelId}]`,
        );
        await client.join(membership.channelId as unknown as string);
      }
    }
    return 'SUCCESS';
  }

  @SubscribeMessage('chat-join')
  @CheckAuth
  async handleJoin(client: Socket, payload: ChatJoinDto) {
    this.logger.log(`${client.id} wants to join room [${payload.channel}]`);
    // TODO: Check if User has permission to join channel here
    const userId = this.authenticatedSockets.get(client.id)?.id;
    const membershipDto: CreateMembershipDto = {
      channelId: +payload.channel,
      userId: this.getAuthenticatedUser(client)?.id,
      role: MembershipRoleType.PARTICIPANT,
      password: payload.password,
    };
    try {
      await this.membershipsService.isUserCapableInChannel(
        { id: userId } as User,
        membershipDto.channelId.toString(),
        {
          muted: undefined,
          banned: false,
        },
      );
      await this.membershipsService.create(membershipDto);
    } catch (error) {
      // TODO: check if the error code is still the same
      if (error.code == 23505) {
        // Duplicate Key Error
        this.logger.log(
          `User ${membershipDto.userId} is already a member of channel ${payload.channel}`,
        );
      } else {
        throw new WsException(error.message);
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
    try {
      const messageResponse = await this.messagesService.create(messageDto);
      const messageResponseDto: ResponseMessageDto =
        instanceToInstance(messageResponse);
      this.server.to(target).emit('chat-message', messageResponseDto);
      return 'Message Confirmed';
    } catch (error) {
      if (error == 'Unauthorized') {
        client.emit(
          'chat-unauthorized',
          'You do not have the authorization to send messages on this channel.',
        );
      }
      throw new WsException(error.message);
    }
  }

  notifyUser(userId: number, type: string, channelName: string) {
    for (const [key, user] of this.authenticatedSockets) {
      if (user.id == userId) {
        const event: string = type == 'mute' ? 'muted' : 'banned';
        const firstHalf = 'You just got ';
        const secondHalf = ` from ${channelName}. You probably know what you did; if not ask the admin !`;
        this.server
          .to(key)
          .emit(`chat-${event}`, `${firstHalf}${event}${secondHalf}`);
      }
    }
    this.authenticatedSockets;
  }

  @SubscribeMessage('chat-karma-user')
  @CheckAuth
  async handleKarma(
    client: Socket,
    payload: {
      userId: number;
      channelId: number;
      duration: number;
      type: string;
    },
  ): Promise<string> {
    this.logger.log('trying karma');
    const userId = payload.userId;
    const channelId = payload.channelId;
    const duration = payload.duration;
    if (
      !userId ||
      !channelId ||
      !duration ||
      (payload.type !== 'mute' && payload.type !== 'ban')
    ) {
      return `ERROR: Invalid payload: ${JSON.stringify(payload)}`;
    }
    this.logger.log(`${client.id} wants to ${payload.type} user ${userId}!`);

    const memberships = await this.membershipsService.findAll({
      user: userId.toString(),
      channel: channelId.toString(),
    });
    if (memberships.length !== 1)
      throw new WsException('Could not locate membership');
    const endDate = new Date(Date.now() + duration);
    try {
      let data = undefined;
      if (payload.type === 'mute') {
        data = {
          mutedUntil: endDate,
        };
      } else {
        data = {
          bannedUntil: endDate,
        };
      }
      this.membershipsService.update(memberships[0].id, data);
      const channelName: string = (
        await this.channelsService.findOne(payload.channelId)
      ).name;
      this.notifyUser(payload.userId, payload.type, channelName);
      return 'Karma Delivered!';
    } catch (error) {
      return 'Karma could not be delivered, try again later.';
    }
  }

  @OnEvent('membership.*')
  handleMembershipEvents(userId: number) {
    this.authenticatedSockets.forEach((user, key) => {
      if (user.id === userId) {
        this.server.to(key).emit('refresh-channels');
      }
    });
  }

  @OnEvent('channel.*')
  handleChannelEvents(channelId: number) {
    this.server.to(channelId as unknown as string).emit('refresh-channels');
  }
}
