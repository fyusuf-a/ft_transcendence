import { BadRequestException, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import UserRepository from './repository/user.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
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
            cb(null, req.params.id + '_avatar.' + file_ext);
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
        limits: { fileSize: 2 * 1000 * 1000 },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
