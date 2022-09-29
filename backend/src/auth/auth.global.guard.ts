import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from './auth.public.decorator';
import { IF_AUTH_IS_DISABLED } from './if-auth-is-disabled.decorator';

@Injectable()
export class GlobalAuthGuard extends AuthGuard('two-auth') {
  constructor(
    private reflector: Reflector,
    private configService: ConfigService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const authenticationDisabled =
      this.configService.get<string>('DISABLE_AUTHENTICATION') === 'true';
    const activateIfAuthIsDisabled = this.reflector.get<boolean>(
      IF_AUTH_IS_DISABLED,
      context.getHandler(),
    );
    if (activateIfAuthIsDisabled && !authenticationDisabled) return false;
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    if (this.configService.get<string>('DISABLE_AUTHENTICATION') === 'true') {
      return true;
    }
    return super.canActivate(context);
  }
}
