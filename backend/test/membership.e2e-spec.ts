import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelsModule } from 'src/channels/channels.module';
import { Channel, ChannelType } from 'src/channels/entities/channel.entity';
import {
  Membership,
  MembershipRoleType,
} from 'src/memberships/entities/membership.entity';
import { MembershipsModule } from 'src/memberships/memberships.module';
import { Message } from 'src/messages/entities/message.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import * as request from 'supertest';
import { Connection } from 'typeorm';
import { Friendship } from 'src/relationships/entities/friendship.entity';
import { Block } from 'src/relationships/entities/block.entity';

describe('MembershipController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MembershipsModule,
        ChannelsModule,
        UsersModule,
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST,
          port: 5432,
          username: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          database: 'e2e_test',
          entities: [Block, Friendship, User, Channel, Message, Membership],
          synchronize: true,
          dropSchema: true,
        }),
      ],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
    );
    await app.init();
  });

  afterAll(async () => {
    const connection = app.get(Connection);
    await connection.close();
    await app.close();
  });

  it('Create user1', () => {
    return request(app.getHttpServer())
      .post('/users/')
      .send({ identity: 'ident1', username: 'user1' })
      .expect(201);
  });
  it('Create user2', () => {
    return request(app.getHttpServer())
      .post('/users/')
      .send({ identity: 'ident2', username: 'user2' })
      .expect(201);
  });
  it('Create Channel', () => {
    return request(app.getHttpServer())
      .post('/channels/')
      .send({ name: 'channel1', type: ChannelType.PUBLIC })
      .expect(201);
  });
  it('Subscribe user1 to channel', () => {
    return request(app.getHttpServer())
      .post('/memberships/')
      .send({ channelId: 1, userId: 1, role: MembershipRoleType.OWNER })
      .expect(201);
  });
  it('Subscribe user2 to channel', () => {
    return request(app.getHttpServer())
      .post('/memberships/')
      .send({ channelId: 1, userId: 2, role: MembershipRoleType.ADMIN })
      .expect(201);
  });

  it('Subscribe user2 to a channel a second time', () => {
    return request(app.getHttpServer())
      .post('/memberships/')
      .send({ channelId: 1, userId: 2, role: MembershipRoleType.PARTICIPANT })
      .expect(500);
  });
  it('Create Channel2', () => {
    return request(app.getHttpServer())
      .post('/channels/')
      .send({ name: 'channel2', type: ChannelType.PUBLIC })
      .expect(201);
  });
  it('Subscribe user2 to channel2', () => {
    return request(app.getHttpServer())
      .post('/memberships/')
      .send({ channelId: 2, userId: 2, role: MembershipRoleType.PARTICIPANT })
      .expect(201);
  });
});
