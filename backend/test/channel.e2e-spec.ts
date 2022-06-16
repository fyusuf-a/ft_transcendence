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
import { ResponseChannelDto } from 'src/channels/dto/response-channel.dto';
import { Channel, ChannelType } from 'src/channels/entities/channel.entity';
import { PageDto } from 'src/common/dto/page.dto';
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
          entities: [User, Channel, Message, Membership],
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

  it('/channels (GET) empty', async () => {
    const response = await request(app.getHttpServer()).get('/channels/');
    expect(response.status).toBe(200);
    expect(response.body.meta.itemCount).toBe(0);
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

  it('/channels (GET) with one', async () => {
    const response = await request(app.getHttpServer()).get('/channels/');
    expect(response.status).toBe(200);
    const responseChannelPages: PageDto<ResponseChannelDto> = response.body;
    expect(responseChannelPages.meta.itemCount).toBe(1);
    expect(responseChannelPages.data[0].name).toBe('channel1');
  });

  it('/channels/1 (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/channels/1');
    expect(response.status).toBe(200);
    const responseChannel: ResponseChannelDto = response.body;
    expect(responseChannel.id).toBe(1);
    expect(responseChannel.name).toBe('channel1');
    expect(responseChannel.type).toBe('public');
  });

  it('/channels (POST)', () => {
    return request(app.getHttpServer())
      .post('/channels')
      .send({
        name: 'channel2',
        type: ChannelType.PROTECTED,
        password: 'example',
      })
      .expect(201);
  });

  it('/channels/2 (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/channels/2');
    expect(response.status).toBe(200);
    const responseChannel: ResponseChannelDto = response.body;
    expect(responseChannel.id).toBe(2);
    expect(responseChannel.name).toBe('channel2');
    expect(responseChannel.type).toBe('protected');
  });

  it('/channels (POST)', () => {
    return request(app.getHttpServer())
      .post('/channels')
      .send({
        name: 'channel3',
        type: ChannelType.PRIVATE,
      })
      .expect(201);
  });

  it('/channels/3 (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/channels/3');
    expect(response.status).toBe(200);
    const responseChannel: ResponseChannelDto = response.body;
    expect(responseChannel.id).toBe(3);
    expect(responseChannel.name).toBe('channel3');
    expect(responseChannel.type).toBe('private');
  });

  it('/channels/3 (DELETE)', () => {
    return request(app.getHttpServer()).delete('/channels/3').expect(200);
  });

  it('/channels/3 (GET)', () => {
    return request(app.getHttpServer()).get('/channels/3').expect(404);
  });
});
