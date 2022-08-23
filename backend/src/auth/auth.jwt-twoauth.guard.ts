import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { canActivateTest } from './auth.jwt-auth.guard';

@Injectable()
export class JwtTwoAuthGuard extends AuthGuard('two-auth') {
  constructor(
    private reflector: Reflector,
    private configService: ConfigService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    if (canActivateTest(context, this.reflector, this.configService))
      return true;
    return super.canActivate(context);
  }
}
