import { Module } from '@nestjs/common';
import { KarmasService } from './karmas.service';
import { KarmasController } from './karmas.controller';

@Module({
  controllers: [KarmasController],
  providers: [KarmasService]
})
export class KarmasModule {}
