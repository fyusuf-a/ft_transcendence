import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { User } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import {
  WsException,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import * as jwt from 'jsonwebtoken';
import { TokenUserDto } from '@dtos/auth';
import { UsersService } from '../users/users.service';

export function CheckAuth(target, key, descriptor) {
  const original = descriptor.value;
  descriptor.value = function (client: Socket, ...args) {
    if (this.authenticatedSockets.has(client.id)) {
      return original.apply(this, [client, ...args]);
    }
    throw new WsException('Not Authorized');
  };
  return descriptor;
}

export class SecureGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  protected authenticatedSockets: Map<string, User> = new Map();
  protected readonly logger: Logger;

  constructor(
    loggerName: string,
    protected readonly usersService: UsersService,
    protected readonly configService: ConfigService,
  ) {
    this.logger = new Logger(loggerName);
  }

  @SubscribeMessage('auth')
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

  protected getAuthenticatedUser(client: Socket): User {
    return this.authenticatedSockets.get(client.id);
  }

  afterInit() {
    this.logger.log('Initialized');
  }

  async handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.authenticatedSockets.delete(client.id);
  }
}
