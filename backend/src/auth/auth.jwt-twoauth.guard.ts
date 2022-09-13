import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from './auth.public.decorator';

@Injectable()
export class JwtTwoAuthGuard extends AuthGuard('two-auth') {
  constructor(
    private reflector: Reflector,
    private configService: ConfigService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (this.configService.get<string>('DISABLE_AUTHENTICATION') === 'true') {
      return true;
    }
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
