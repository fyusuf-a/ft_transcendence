import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MessagesModule } from './../src/messages/messages.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Message } from './../src/messages/entities/message.entity';
import { Karma } from '../src/karmas/entities/karma.entity';
import { User } from '../src/users/entities/user.entity';
import { Channel, ChannelType } from '../src/channels/entities/channel.entity';
import { Membership } from '../src/memberships/entities/membership.entity';
import { Connection } from 'typeorm';
import { UsersModule } from 'src/users/users.module';
import { ChannelsModule } from 'src/channels/channels.module';

describe('MessagesController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MessagesModule,
        UsersModule,
        ChannelsModule,
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST,
          port: 5432,
          username: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          database: 'e2e_test',
          entities: [Message, Channel, Karma, User, Membership],
          synchronize: true,
          dropSchema: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    const connection = app.get(Connection);
    await connection.close();
    await app.close();
  });

  it('prepare users1', () => {
    return request(app.getHttpServer())
      .post('/users/')
      .send({
        identity: 'ident1',
        username: 'user1',
      })
      .expect(201);
  });
  it('prepare users2', () => {
    return request(app.getHttpServer())
      .post('/users/')
      .send({
        identity: 'ident2',
        username: 'user2',
      })
      .expect(201);
  });
  it('prepare channel', () => {
    return request(app.getHttpServer())
      .post('/channels/')
      .send({
        name: 'channel1',
        type: ChannelType.PUBLIC,
      })
      .expect(201);
  });

  it('/messages (GET)', () => {
    return request(app.getHttpServer())
      .get('/messages/')
      .expect(200)
      .expect('[]');
  });

  it('/messages (POST)', () => {
    return request(app.getHttpServer())
      .post('/messages')
      .send({
        content: 'Test message',
        senderId: 1,
        channelId: 1,
      })
      .expect(201);
  });

  it('/messages/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/messages/')
      .expect(200)
      .expect('[{"id":1,"content":"Test message","senderId":1,"channelId":1}]');
  });

  it('/messages/1 (GET)', () => {
    return request(app.getHttpServer())
      .get('/messages/1')
      .expect(200)
      .expect('{"id":1,"content":"Test message","senderId":1,"channelId":1}');
  });

  it('/messages/2 (GET) before created', () => {
    return request(app.getHttpServer()).get('/messages/2').expect(404);
  });

  it('/messages (POST) second message', () => {
    return request(app.getHttpServer())
      .post('/messages')
      .send({
        content: 'Test message2',
        senderId: 2,
        channelId: 1,
      })
      .expect(201);
  });

  it('/messages/2 (GET)', () => {
    return request(app.getHttpServer())
      .get('/messages/2')
      .expect(200)
      .expect('{"id":2,"content":"Test message2","senderId":2,"channelId":1}');
  });

  it('/messages/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/messages/')
      .expect(200)
      .expect(
        '[{"id":1,"content":"Test message","senderId":1,"channelId":1},{"id":2,"content":"Test message2","senderId":2,"channelId":1}]',
      );
  });

  it('/messages (POST) duplicate message', () => {
    return request(app.getHttpServer())
      .post('/messages')
      .send({
        content: 'Test message2',
        senderId: 2,
        channelId: 1,
      })
      .expect(201);
  });

  it('/messages/2 (DELETE)', () => {
    return request(app.getHttpServer()).delete('/messages/2').expect(200);
  });

  it('/messages/2 (DELETE)', () => {
    return request(app.getHttpServer()).delete('/messages/2').expect(200);
  });

  it('/messages/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/messages/')
      .expect(200)
      .expect(
        '[{"id":1,"content":"Test message","senderId":1,"channelId":1},{"id":3,"content":"Test message2","senderId":2,"channelId":1}]',
      );
  });
});