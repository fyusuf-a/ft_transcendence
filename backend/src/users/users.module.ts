import { BadRequestException, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Friendship } from 'src/relationships/entities/friendship.entity';
import { Block } from 'src/relationships/entities/block.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { User } from './entities/user.entity';
import { AchievementsLog } from 'src/achievements-log/entities/achievements-log.entity';
import { Match } from 'src/matches/entities/match.entity';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Friendship, Block, AchievementsLog, Match]),
    CaslModule,
    ConfigModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        storage: diskStorage({
          destination: `${configService.get<string>('UPLOADS_PATH')}`,
          filename: (req, file, cb) => {
            const mimetype = file.mimetype.split('/');
            const file_ext = mimetype[mimetype.length - 1];
            if (file_ext === undefined) {
              throw new BadRequestException('Invalid File Type');
            }
            cb(
              null,
              req.params.id +
                configService.get<string>('AVATAR_SUFFIX') +
                file_ext,
            );
          },
        }),
        fileFilter: (req, file, cb) => {
          const mimetype = file.mimetype.split('/');
          const ext = mimetype[mimetype.length - 1];
          if (!['gif', 'jpeg', 'png'].includes(ext)) {
            return cb(new BadRequestException('Invalid File Type'), false);
          }
          return cb(null, true);
        },
        limits: { fileSize: configService.get<number>('MAX_FILE_SIZE') },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService, TypeOrmModule.forFeature([User])],
})
export class UsersModule {}
