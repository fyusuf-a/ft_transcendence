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
import { Karma } from '../src/karmas/entities/karma.entity';
import { Channel } from '../src/channels/entities/channel.entity';
import { Reflector } from '@nestjs/core';
import { Connection } from 'typeorm';
// import { Repository } from 'typeorm';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  // let userRepository: Repository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST,
          port: 5432,
          username: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          database: 'e2e_test',
          entities: [User, Channel, Membership, Message, Karma],
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
    // userRepository = moduleFixture.get('UserRepository');
  });

  afterAll(async () => {
    const connection = app.get(Connection);
    await connection.close();
    await app.close();
  });

  it('/users (GET)', () => {
    return request(app.getHttpServer()).get('/users/').expect(200).expect('[]');
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

  it('/users/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/users/')
      .expect(200)
      .expect(
        '[{"id":1,"username":"username1","avatar":null,"wins":0,"losses":0,"rating":0}]',
      );
  });

  it('/users/1 (GET)', () => {
    return request(app.getHttpServer())
      .get('/users/1')
      .expect(200)
      .expect(
        '{"id":1,"username":"username1","avatar":null,"wins":0,"losses":0,"rating":0}',
      );
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

  it('/users/2 (GET)', () => {
    return request(app.getHttpServer())
      .get('/users/2')
      .expect(200)
      .expect(
        '{"id":2,"username":"username2","avatar":null,"wins":0,"losses":0,"rating":0}',
      );
  });

  it('/users/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/users/')
      .expect(200)
      .expect(
        '[{"id":1,"username":"username1","avatar":null,"wins":0,"losses":0,"rating":0},{"id":2,"username":"username2","avatar":null,"wins":0,"losses":0,"rating":0}]',
      );
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

  it('/users/2 (GET) after PATCH', () => {
    return request(app.getHttpServer())
      .get('/users/2')
      .expect(200)
      .expect(
        '{"id":2,"username":"username-two","avatar":null,"wins":0,"losses":0,"rating":0}',
      );
  });

  it('/users/2 (DELETE)', () => {
    return request(app.getHttpServer()).delete('/users/2').expect(200);
  });

  it('/users/2 (DELETE)', () => {
    return request(app.getHttpServer()).delete('/users/2').expect(200);
  });

  it('/users/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/users/')
      .expect(200)
      .expect(
        '[{"id":1,"username":"username1","avatar":null,"wins":0,"losses":0,"rating":0}]',
      );
  });

  // it('/users/1/messages (GET)', () => {
  //   return request(app.getHttpServer())
  //     .get('/users/')
  //     .expect(200)
  //     .expect(
  //       '[{"id":1,"username":"username1","avatar":null,"wins":0,"losses":0,"rating":0}]',
  //     );
  // });
});
