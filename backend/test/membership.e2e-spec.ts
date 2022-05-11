import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel, ChannelType } from 'src/channels/entities/channel.entity';
import { Karma } from 'src/karmas/entities/karma.entity';
import {
  Membership,
  MembershipRoleType,
} from 'src/memberships/entities/membership.entity';
import { MembershipsModule } from 'src/memberships/memberships.module';
import { Message } from 'src/messages/entities/message.entity';
import { User } from 'src/users/entities/user.entity';
import * as request from 'supertest';
import { Connection } from 'typeorm';

describe('MembershipController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MembershipsModule,
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

  it('Subscribe users to channel', () => {
    request(app.getHttpServer())
      .post('/users/')
      .send({ identity: 'ident1', username: 'user1' });
    request(app.getHttpServer())
      .post('/users/')
      .send({ identity: 'ident2', username: 'user2' });
    request(app.getHttpServer())
      .post('/channels/')
      .send({ name: 'channel1', type: ChannelType.PUBLIC });
    request(app.getHttpServer())
      .post('/memberships/')
      .send({ channelId: 1, userId: 1, role: MembershipRoleType.OWNER });
    request(app.getHttpServer())
      .post('/memberships/')
      .send({ channelId: 1, userId: 2, role: MembershipRoleType.ADMIN })
      .expect(201);
  });
});
