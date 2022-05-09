import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { MessagesModule } from './messages/messages.module';
import { Message } from './messages/message.entity';
import { ChannelsModule } from './channels/channels.module';
import { Channel } from './channels/entities/channel.entity';
import { Karma } from './karmas/entities/karma.entity';
import { KarmasModule } from './karmas/karmas.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Message, Channel, Karma],
      synchronize: true,
    }),
    UsersModule,
    MessagesModule,
    ChannelsModule,
    KarmasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
