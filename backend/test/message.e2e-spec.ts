import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MessagesModule } from './../src/messages/messages.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Message } from './../src/messages/entities/message.entity';
import { User } from '../src/users/entities/user.entity';
import { Channel, ChannelType } from '../src/channels/entities/channel.entity';
import { Membership } from '../src/memberships/entities/membership.entity';
import { Connection } from 'typeorm';
import { UsersModule } from 'src/users/users.module';
import { ChannelsModule } from 'src/channels/channels.module';
import { ResponseMessageDto } from 'src/messages/dto/response-message.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { Friendship } from 'src/relationships/entities/friendship.entity';
import { Block } from 'src/relationships/entities/block.entity';

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
          entities: [Block, Friendship, Message, Channel, User, Membership],
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

  it('/messages (GET) with no messages', async () => {
    const response = await request(app.getHttpServer()).get('/messages/');
    expect(response.status).toBe(200);
    const responseMessagePages: PageDto<ResponseMessageDto> = response.body;
    expect(responseMessagePages.meta.itemCount).toBe(0);
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

  it('/messages/ (GET) after first message', async () => {
    const response = await request(app.getHttpServer()).get('/messages/');
    expect(response.status).toBe(200);
    const responseMessagePages: PageDto<ResponseMessageDto> = response.body;
    expect(responseMessagePages.meta.itemCount).toBe(1);
    expect(responseMessagePages.data[0].senderId).toBe(1);
    expect(responseMessagePages.data[0].channelId).toBe(1);
    expect(responseMessagePages.data[0].content).toBe('Test message');
  });

  it('/messages/1 (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/messages/1');
    expect(response.status).toBe(200);
    const responseMessage: ResponseMessageDto = response.body;
    expect(responseMessage.senderId).toBe(1);
    expect(responseMessage.channelId).toBe(1);
    expect(responseMessage.content).toBe('Test message');
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

  it('/messages/2 (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/messages/2');
    expect(response.status).toBe(200);
    const responseMessage: ResponseMessageDto = response.body;
    expect(responseMessage.senderId).toBe(2);
    expect(responseMessage.channelId).toBe(1);
    expect(responseMessage.content).toBe('Test message2');
  });

  it('/messages/ (GET) after second message', async () => {
    const response = await request(app.getHttpServer()).get('/messages/');
    expect(response.status).toBe(200);
    const responseMessagePages: PageDto<ResponseMessageDto> = response.body;
    expect(responseMessagePages.meta.itemCount).toBe(2);
    expect(responseMessagePages.data[0].senderId).toBe(1);
    expect(responseMessagePages.data[0].channelId).toBe(1);
    expect(responseMessagePages.data[0].content).toBe('Test message');
    expect(responseMessagePages.data[1].senderId).toBe(2);
    expect(responseMessagePages.data[1].channelId).toBe(1);
    expect(responseMessagePages.data[1].content).toBe('Test message2');
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

  it('/messages/ (GET) after duplicate message', async () => {
    const response = await request(app.getHttpServer()).get('/messages/');
    expect(response.status).toBe(200);
    const responseMessagePages: PageDto<ResponseMessageDto> = response.body;
    expect(responseMessagePages.meta.itemCount).toBe(3);
  });

  it('/messages/2 (DELETE)', () => {
    return request(app.getHttpServer()).delete('/messages/2').expect(200);
  });

  it('/messages/2 (DELETE)', () => {
    return request(app.getHttpServer()).delete('/messages/2').expect(200);
  });

  it('/messages/3 (DELETE)', () => {
    return request(app.getHttpServer()).delete('/messages/3').expect(200);
  });

  it('/messages/ (GET) after delete', async () => {
    const response = await request(app.getHttpServer()).get('/messages/');
    expect(response.status).toBe(200);
    const responseMessagePages: PageDto<ResponseMessageDto> = response.body;
    expect(responseMessagePages.meta.itemCount).toBe(1);
    expect(responseMessagePages.data[0].senderId).toBe(1);
    expect(responseMessagePages.data[0].channelId).toBe(1);
    expect(responseMessagePages.data[0].content).toBe('Test message');
  });
});
