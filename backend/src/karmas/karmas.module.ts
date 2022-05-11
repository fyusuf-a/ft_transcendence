import { Module } from '@nestjs/common';
import { KarmasService } from './karmas.service';
import { KarmasController } from './karmas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Karma } from './entities/karma.entity';
import { Channel } from 'src/channels/entities/channel.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Karma, User, Channel])],
  controllers: [KarmasController],
  providers: [KarmasService],
  exports: [KarmasService],
})
export class KarmasModule {}
