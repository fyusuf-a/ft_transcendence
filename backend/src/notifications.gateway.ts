import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket, Server } from 'socket.io';
import { UsersService } from './users/users.service';
import { ConfigService } from '@nestjs/config';
import { SecureGateway } from './auth/auth.websocket';
import { Match } from './matches/entities/match.entity';
import { MatchStatusType } from './dtos/matches';
import { User, UserStatusEnum } from './users/entities/user.entity';
import { Repository } from 'typeorm';
import { ListFriendshipDto } from './dtos/friendships';

@WebSocketGateway({ cors: true, namespace: 'notifications' })
export class NotificationsGateway extends SecureGateway {
  constructor(
    protected readonly usersService: UsersService,
    protected readonly configService: ConfigService,
    @InjectRepository(User)
    protected readonly usersRepository: Repository<User>,
    @InjectRepository(Match)
    protected readonly matchRepository: Repository<Match>,
  ) {
    super('NotificationsGateway', usersService, configService);
  }

  @WebSocketServer() server: Server;

  async handleConnection(client: Socket) {
    this.handleAuth(client, {
      id: +client.handshake.query.id,
      token: client.handshake.query.token as string,
    });
    this.logger.log(
      `User ${client.handshake.query.id} connected on socket ${client.id} `,
    );
    const user: User = await this.usersService.findOne(
      +client.handshake.query.id,
    );
    try {
      this.matchRepository.findOneByOrFail([
        {
          status: MatchStatusType.IN_PROGRESS,
          homeId: +client.handshake.query.id,
        },
        {
          status: MatchStatusType.IN_PROGRESS,
          awayId: +client.handshake.query.id,
        },
      ]);
      user.status = UserStatusEnum.ingame;
      this.usersRepository.save(user);
    } catch {
      user.status = UserStatusEnum.online;
      this.usersRepository.save(user);
    }
  }
  async handleDisconnect(client: Socket) {
    this.authenticatedSockets.delete(client.id);
    let user: User;
    try {
      user = await this.usersService.findOne(+client.handshake.query.id);
    } catch {
      this.logger.log(
        'Error disconnecting user ${client.handshake.query.id}: Entity Not Found.',
      );
      return;
    }
    this.logger.log(
      `User ${client.handshake.query.id} disconnected from socket ${client.id} `,
    );
    const values: User[] = [...this.authenticatedSockets.values()];
    if (values.some((u) => u.id == user.id)) return;

    const friendsList: ListFriendshipDto[] =
      await this.usersService.findFriendships(user.id, 1);
    const friendsIds: number[] = friendsList.map((a) =>
      a.targetId == user.id ? a.sourceId : a.targetId,
    );
    this.authenticatedSockets.forEach((value: User, key: string) => {
      if (friendsIds.includes(value.id))
        this.server.sockets[key].emit('status-update', {
          id: value.id,
          status: user.status,
        });
      user.status = UserStatusEnum.offline;
      this.usersRepository.save(user);
    });
  }

  async handleDisconnectPhony(id: number) {
    const friendsList: ListFriendshipDto[] =
      await this.usersService.findFriendships(id, 1);
    const friendsIds: number[] = friendsList.map((a) =>
      a.targetId == id ? a.sourceId : a.targetId,
    );
    this.authenticatedSockets.forEach((value: User, key: string) => {
      if (friendsIds.includes(value.id))
        this.server.to(key).emit('status-update', {
          id: id,
          status: 0,
        });
    });
  }
  async handleMatchStatusUpdate(
    home: User,
    homeFriendList: ListFriendshipDto[],
    away: User,
    awayFriendList: ListFriendshipDto[],
  ) {
    const homeFriendsIds: number[] = homeFriendList.map((a) =>
      a.targetId == home.id ? a.sourceId : a.targetId,
    );
    const awayFriendsIds: number[] = awayFriendList.map((a) =>
      a.targetId == away.id ? a.sourceId : a.targetId,
    );

    this.authenticatedSockets.forEach((value: User, key: string) => {
      if (homeFriendsIds.includes(value.id))
        this.server.sockets[key].emit('status-update', {
          id: value.id,
          status: home.status,
        });
      if (awayFriendsIds.includes(value.id))
        this.server.sockets[key].emit('status-update', {
          id: value.id,
          status: away.status,
        });
    });
  }
}
