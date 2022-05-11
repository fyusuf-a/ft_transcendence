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
import { Karma } from 'src/karmas/entities/karma.entity';
import { Membership } from 'src/memberships/entities/membership.entity';
import { Message } from 'src/messages/entities/message.entity';
import { User } from 'src/users/entities/user.entity';
import * as request from 'supertest';
import { Connection } from 'typeorm';

describe('ChannelController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ChannelsModule,
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

  it('/channels (GET) empty', () => {
    return request(app.getHttpServer())
      .get('/channels/')
      .expect(200)
      .expect('[]');
  });

  it('/channels (POST)', () => {
    return request(app.getHttpServer())
      .post('/channels')
      .send({
        name: 'channel1',
        type: ChannelType.PUBLIC,
      })
      .expect(201);
  });

  it('/channels (GET) with one', () => {
    return request(app.getHttpServer())
      .get('/channels/')
      .expect(200)
      .expect('[{"id":1,"name":"channel1","type":"public","password":null}]');
  });

  it('/channels/1 (GET)', () => {
    return request(app.getHttpServer())
      .get('/channels/1')
      .expect(200)
      .expect('{"id":1,"name":"channel1","type":"public","password":null}');
  });
});
