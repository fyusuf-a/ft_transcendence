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
    const user: User = await this.usersRepository.findOneByOrFail({
      id: +client.handshake.query.id,
    });
    if (
      await this.matchRepository.findOneBy([
        {
          status: MatchStatusType.IN_PROGRESS,
          homeId: +client.handshake.query.id,
        },
        {
          status: MatchStatusType.IN_PROGRESS,
          awayId: +client.handshake.query.id,
        },
      ])
    ) {
      user.status = UserStatusEnum.ingame;
      await this.usersRepository.save(user);
    } else {
      user.status = UserStatusEnum.online;
      await this.usersRepository.save(user);
    }
    const friendsList: ListFriendshipDto[] =
      await this.usersService.findFriendships(user.id, 1);
    const friendsIds: number[] = friendsList.map((a) =>
      a.targetId == user.id ? a.sourceId : a.targetId,
    );
    this.authenticatedSockets.forEach((value: User, key: string) => {
      if (friendsIds.includes(value.id))
        this.server.to(key).emit('status-update', {
          id: user.id,
          status: user.status,
        });
    });
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
    this.logger.log(`User ${user.id} disconnected from socket ${client.id} `);
    const values: User[] = [...this.authenticatedSockets.values()];
    if (values.some((u) => u.id == user.id)) return;

    user.status = UserStatusEnum.offline;
    await this.usersRepository.save(user);

    const friendsList: ListFriendshipDto[] =
      await this.usersService.findFriendships(user.id, 1);
    const friendsIds: number[] = friendsList.map((a) =>
      a.targetId == user.id ? a.sourceId : a.targetId,
    );
    this.authenticatedSockets.forEach((value: User, key: string) => {
      if (friendsIds.includes(value.id))
        this.server.to(key).emit('status-update', {
          id: user.id,
          status: user.status,
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
      console.log(value.id);
      if (homeFriendsIds.includes(value.id)) {
        this.server.to(key).emit('status-update', {
          id: home.id,
          status: 2,
        });
      }
      if (awayFriendsIds.includes(value.id)) {
        this.server.to(key).emit('status-update', {
          id: away.id,
          status: 2,
        });
      }
    });
  }
}
