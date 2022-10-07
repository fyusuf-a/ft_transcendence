import { Test, TestingModule } from '@nestjs/testing';
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from './../src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from '../src/users/entities/user.entity';
import { Membership } from '../src/memberships/entities/membership.entity';
import { Message } from '../src/messages/entities/message.entity';
import { Channel } from '../src/channels/entities/channel.entity';
import { Reflector } from '@nestjs/core';
import { Connection } from 'typeorm';
import { ResponseUserDto } from '@dtos/users';
import { PageDto } from '@dtos/pages';
import { Friendship } from 'src/relationships/entities/friendship.entity';
import { Block } from 'src/relationships/entities/block.entity';
import { Achievement } from 'src/achievements/entities/achievements.entity';
import { AchievementsLog } from 'src/achievements-log/entities/achievements-log.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        ConfigModule.forRoot(),
        EventEmitterModule.forRoot(),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST,
          port: 5432,
          username: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          database: 'e2e_test',
          entities: [
            Achievement,
            AchievementsLog,
            Block,
            Friendship,
            User,
            Channel,
            Membership,
            Message,
          ],
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

  it('/users (GET) empty', async () => {
    const response = await request(app.getHttpServer()).get('/users/');
    expect(response.status).toEqual(200);
    const responseUserPages: PageDto<ResponseUserDto> = response.body;
    expect(responseUserPages.meta.itemCount).toBe(0);
    expect(responseUserPages.data).toEqual([]);
  });

  it('/users (POST)', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        identity: 'identity1',
        username: 'username1',
      })
      .expect(201);
  });

  it('/users/ (GET) with one', async () => {
    const response = await request(app.getHttpServer()).get('/users/');
    expect(response.status).toEqual(200);
    const responseUserPages: PageDto<ResponseUserDto> = response.body;
    expect(responseUserPages.meta.itemCount).toBe(1);
    expect(responseUserPages.data[0].username).toBe('username1');
  });

  it('/users/1 (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/users/1');
    expect(response.status).toEqual(200);
    const responseUser: ResponseUserDto = response.body;
    expect(responseUser.id).toBe(1);
    expect(responseUser.username).toBe('username1');
    expect(responseUser.wins).toBe(0);
    expect(responseUser.losses).toBe(0);
    expect(responseUser.rating).toBeDefined();
  });

  it('/users/2 (GET) before created', () => {
    return request(app.getHttpServer()).get('/users/2').expect(404);
  });

  it('/users (POST)', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        identity: 'identity2',
        username: 'username2',
      })
      .expect(201);
  });

  it('/users/2 (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/users/2');
    expect(response.status).toEqual(200);
    const responseUser: ResponseUserDto = response.body;
    expect(responseUser.id).toBe(2);
    expect(responseUser.username).toBe('username2');
    expect(responseUser.wins).toBe(0);
    expect(responseUser.losses).toBe(0);
    expect(responseUser.rating).toBeDefined();
  });

  it('/users/ (GET) with 2', async () => {
    const response = await request(app.getHttpServer()).get('/users/');
    expect(response.status).toEqual(200);
    const responseUserPages: PageDto<ResponseUserDto> = response.body;
    expect(responseUserPages.meta.itemCount).toBe(2);
    expect(responseUserPages.data[0].username).toBe('username1');
    expect(responseUserPages.data[1].username).toBe('username2');
  });

  it('/users duplicate identity (POST)', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        identity: 'identity2',
        username: 'username2',
      })
      .expect(500);
  });

  it('/users (PATCH)', () => {
    return request(app.getHttpServer())
      .patch('/users/2')
      .send({
        username: 'username-two',
      })
      .expect(200);
  });

  it('/users/2 (GET) after PATCH', async () => {
    const response = await request(app.getHttpServer()).get('/users/2');
    expect(response.status).toEqual(200);
    const responseUser: ResponseUserDto = response.body;
    expect(responseUser.id).toBe(2);
    expect(responseUser.username).toBe('username-two');
    expect(responseUser.wins).toBe(0);
    expect(responseUser.losses).toBe(0);
    expect(responseUser.rating).toBeDefined();
  });

  it('/users/2 (DELETE)', () => {
    return request(app.getHttpServer()).delete('/users/2').expect(200);
  });

  it('/users/2 (DELETE)', () => {
    return request(app.getHttpServer()).delete('/users/2').expect(200);
  });

  it('/users/ (GET) after delete', async () => {
    const response = await request(app.getHttpServer()).get('/users/');
    expect(response.status).toEqual(200);
    const responseUserPages: PageDto<ResponseUserDto> = response.body;
    expect(responseUserPages.meta.itemCount).toBe(1);
    expect(responseUserPages.data[0].username).toBe('username1');
  });
});
