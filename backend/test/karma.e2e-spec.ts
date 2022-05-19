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
import { Karma, KarmaType } from 'src/karmas/entities/karma.entity';
import { KarmasModule } from 'src/karmas/karmas.module';
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

describe('KarmaController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        KarmasModule,
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
          entities: [User, Channel, Message, Membership, Karma],
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

  it('Mute user1 in channel1', () => {
    return request(app.getHttpServer())
      .post('/karmas/')
      .send({
        channelId: 1,
        userId: 1,
        start: '2022-05-19T11:37:48.745Z',
        end: '2022-05-19T11:37:48.745Z',
        type: KarmaType.MUTE,
      })
      .expect(201);
  });

  it('Get Karma1 after creation', () => {
    return request(app.getHttpServer())
      .get('/karmas/1')
      .expect(200)
      .expect(
        '{"id":1,"start":"2022-05-19T11:37:48.745Z","end":"2022-05-19T11:37:48.745Z","type":"mute","channelId":1,"userId":1}',
      );
  });

  it('Patch Karma1 to BAN', () => {
    return request(app.getHttpServer())
      .patch('/karmas/1')
      .send({
        type: KarmaType.BAN,
        channelId: 1,
      })
      .expect(200);
  });

  it('Get Karma1 after patch', () => {
    return request(app.getHttpServer())
      .get('/karmas/1')
      .expect(200)
      .expect(
        '{"id":1,"start":"2022-05-19T11:37:48.745Z","end":"2022-05-19T11:37:48.745Z","type":"ban","channelId":1,"userId":1}',
      );
  });

  it('Patch Karma1 to BAN', () => {
    return request(app.getHttpServer()).delete('/karmas/1').expect(200);
  });

  it('Get Karmas after delete', () => {
    return request(app.getHttpServer())
      .get('/karmas/')
      .expect(200)
      .expect('[]');
  });
});
