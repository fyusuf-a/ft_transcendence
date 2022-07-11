import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CaslAbilityFactory } from './casl-ability.factory';

@Module({
  providers: [CaslAbilityFactory, ConfigService],
  exports: [CaslAbilityFactory],
})
export class CaslModule {}
