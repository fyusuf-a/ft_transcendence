import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
  } from '@nestjs/websockets';
  import { Socket, Server } from 'socket.io';
  import { UsersService } from './users/users.service';
  import { ConfigService } from '@nestjs/config';
  import { SecureGateway, CheckAuth } from './auth/auth.websocket';
  
  import {User, UserStatusEnum} from './users/entities/user.entity';
import { Repository } from 'typeorm';

  @WebSocketGateway({ cors: true, namespace: 'notifications' })
  export class NotificationsGateway extends SecureGateway {
    constructor(
      protected readonly usersService: UsersService,
      protected readonly configService: ConfigService,
      protected readonly usersRepository: Repository<User>

    ) {
      super('NotificationsGateway', usersService, configService);
    }
  
    @WebSocketServer() server: Server;
  
    @SubscribeMessage('connect')
    @CheckAuth
    async handleConnect(client: Socket, payload: any) {
        console.log("connect event received. id = " + client.id);
      const user : User = await this.usersService.findOne(+client.id);
      user.status = UserStatusEnum.online;
      this.usersRepository.save(user);

    }

    @SubscribeMessage('disconnect')
    @CheckAuth
    async handleDisonnect(client: Socket, payload: any) {
        console.log("disconnect event received. id = " + client.id);
      const user : User = await this.usersService.findOne(+client.id);
      user.status = UserStatusEnum.offline;
      this.usersRepository.save(user);
    }
  
  }
  