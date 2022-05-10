import { Module } from '@nestjs/common';
import { KarmasService } from './karmas.service';
import { KarmasController } from './karmas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Karma } from './entities/karma.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Karma]),
  ],
  controllers: [KarmasController],
  providers: [KarmasService],
  exports: [KarmasService],
})
export class KarmasModule {}
