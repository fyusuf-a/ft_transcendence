import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from './auth.public.decorator';

export function canActivateTest(
  context: ExecutionContext,
  reflector: Reflector,
  configService: ConfigService,
): boolean {
  const isPublic = reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
    context.getHandler(),
    context.getClass(),
  ]);
  if (configService.get<string>('DISABLE_AUTHENTICATION') === 'true') {
    return true;
  }
  if (isPublic) {
    return true;
  }
  return false;
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
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
